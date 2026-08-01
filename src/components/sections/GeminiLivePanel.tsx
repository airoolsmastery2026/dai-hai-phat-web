"use client";

import { Mic, PhoneOff, Radio, ShieldCheck, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  GEMINI_LIVE_SYSTEM_INSTRUCTION,
  GEMINI_LIVE_WEBSOCKET_ENDPOINT,
  type GeminiLiveTokenResponse,
} from "@/lib/ai/live";
import type { AIService } from "@/lib/ai/service-domain";

type LiveStatus = "idle" | "connecting" | "listening" | "error";

interface GeminiLivePanelProps {
  servicePreset: AIService | null;
}

interface LiveServerMessage {
  setupComplete?: unknown;
  serverContent?: {
    interrupted?: boolean;
    inputTranscription?: { text?: unknown };
    outputTranscription?: { text?: unknown };
    modelTurn?: {
      parts?: Array<{
        inlineData?: { data?: unknown; mimeType?: unknown };
      }>;
    };
  };
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return window.btoa(binary);
}

function decodeBase64(value: string): Uint8Array {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function downsampleToPcm16(
  input: Float32Array,
  inputSampleRate: number,
  outputSampleRate = 16_000,
): Uint8Array {
  const ratio = inputSampleRate / outputSampleRate;
  const outputLength = Math.max(1, Math.floor(input.length / ratio));
  const buffer = new ArrayBuffer(outputLength * 2);
  const view = new DataView(buffer);

  for (let index = 0; index < outputLength; index += 1) {
    const sourceIndex = Math.min(
      input.length - 1,
      Math.floor(index * ratio),
    );
    const sample = Math.max(-1, Math.min(1, input[sourceIndex]));
    view.setInt16(
      index * 2,
      sample < 0 ? sample * 0x8000 : sample * 0x7fff,
      true,
    );
  }

  return new Uint8Array(buffer);
}

function readAudioSampleRate(mimeType: unknown): number {
  if (typeof mimeType !== "string") return 24_000;
  const match = /rate=(\d+)/i.exec(mimeType);
  const sampleRate = match ? Number(match[1]) : 24_000;
  return Number.isFinite(sampleRate) && sampleRate >= 8_000
    ? sampleRate
    : 24_000;
}

export function GeminiLivePanel({ servicePreset }: GeminiLivePanelProps) {
  const [status, setStatus] = useState<LiveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [userTranscript, setUserTranscript] = useState("");
  const [assistantTranscript, setAssistantTranscript] = useState("");

  const websocketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const playbackCursorRef = useRef(0);
  const playbackSourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const closingRef = useRef(false);

  const stopPlayback = useCallback(() => {
    playbackSourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // The source may already have finished.
      }
    });
    playbackSourcesRef.current.clear();
    playbackCursorRef.current = outputContextRef.current?.currentTime ?? 0;
  }, []);

  const stopMicrophone = useCallback(() => {
    processorRef.current?.disconnect();
    inputSourceRef.current?.disconnect();
    silentGainRef.current?.disconnect();
    processorRef.current = null;
    inputSourceRef.current = null;
    silentGainRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const context = inputContextRef.current;
    inputContextRef.current = null;
    if (context) void context.close();
  }, []);

  const stopSession = useCallback(() => {
    closingRef.current = true;
    stopMicrophone();
    stopPlayback();
    websocketRef.current?.close(1000, "User ended the live session");
    websocketRef.current = null;
    const outputContext = outputContextRef.current;
    outputContextRef.current = null;
    if (outputContext) void outputContext.close();
    setStatus("idle");
  }, [stopMicrophone, stopPlayback]);

  const playAudio = useCallback(async (data: string, mimeType: unknown) => {
    const context = outputContextRef.current;
    if (!context) return;
    if (context.state === "suspended") await context.resume();

    const bytes = decodeBase64(data);
    const sampleRate = readAudioSampleRate(mimeType);
    const sampleCount = Math.floor(bytes.byteLength / 2);
    if (!sampleCount) return;

    const audioBuffer = context.createBuffer(1, sampleCount, sampleRate);
    const channel = audioBuffer.getChannelData(0);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    for (let index = 0; index < sampleCount; index += 1) {
      channel[index] = view.getInt16(index * 2, true) / 0x8000;
    }

    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    const startAt = Math.max(context.currentTime, playbackCursorRef.current);
    source.start(startAt);
    playbackCursorRef.current = startAt + audioBuffer.duration;
    playbackSourcesRef.current.add(source);
    source.onended = () => playbackSourcesRef.current.delete(source);
  }, []);

  const startMicrophone = useCallback(async () => {
    const stream = streamRef.current;
    const websocket = websocketRef.current;
    if (!stream || !websocket || processorRef.current) return;

    const context = new AudioContext();
    await context.resume();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(4096, 1, 1);
    const silentGain = context.createGain();
    silentGain.gain.value = 0;

    processor.onaudioprocess = (event) => {
      const activeSocket = websocketRef.current;
      if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) return;
      const pcm = downsampleToPcm16(
        event.inputBuffer.getChannelData(0),
        context.sampleRate,
      );
      activeSocket.send(
        JSON.stringify({
          realtimeInput: {
            audio: {
              data: encodeBase64(pcm),
              mimeType: "audio/pcm;rate=16000",
            },
          },
        }),
      );
    };

    source.connect(processor);
    processor.connect(silentGain);
    silentGain.connect(context.destination);
    inputContextRef.current = context;
    inputSourceRef.current = source;
    processorRef.current = processor;
    silentGainRef.current = silentGain;
    setStatus("listening");
  }, []);

  const handleServerMessage = useCallback(
    (message: LiveServerMessage) => {
      if (message.setupComplete !== undefined) {
        void startMicrophone();
        const websocket = websocketRef.current;
        if (websocket?.readyState === WebSocket.OPEN) {
          const context = servicePreset
            ? `Khách đang quan tâm hạng mục ${servicePreset}. Hãy chào ngắn gọn và hỏi nhu cầu đầu tiên.`
            : "Hãy chào khách ngắn gọn và hỏi hạng mục dân dụng hoặc nội thất họ cần tư vấn.";
          websocket.send(JSON.stringify({ realtimeInput: { text: context } }));
        }
      }

      const serverContent = message.serverContent;
      if (!serverContent) return;
      if (serverContent.interrupted) stopPlayback();
      if (typeof serverContent.inputTranscription?.text === "string") {
        setUserTranscript(serverContent.inputTranscription.text);
      }
      if (typeof serverContent.outputTranscription?.text === "string") {
        setAssistantTranscript(serverContent.outputTranscription.text);
      }

      serverContent.modelTurn?.parts?.forEach((part) => {
        const data = part.inlineData?.data;
        if (typeof data === "string" && data) {
          void playAudio(data, part.inlineData?.mimeType);
        }
      });
    },
    [playAudio, servicePreset, startMicrophone, stopPlayback],
  );

  const startSession = useCallback(async () => {
    if (status === "connecting" || status === "listening") return;
    setStatus("connecting");
    setError(null);
    setUserTranscript("");
    setAssistantTranscript("");
    closingRef.current = false;

    try {
      if (!navigator.mediaDevices?.getUserMedia || !("WebSocket" in window)) {
        throw new Error("Trình duyệt này chưa hỗ trợ trò chuyện thoại trực tiếp.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      streamRef.current = stream;
      const outputContext = new AudioContext();
      outputContextRef.current = outputContext;
      await outputContext.resume();

      const response = await fetch("/api/ai/live-token", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = (await response.json()) as GeminiLiveTokenResponse;
      if (!response.ok || !payload.token || !payload.model) {
        throw new Error(payload.error || "Chưa thể mở phiên thoại trực tiếp.");
      }

      const websocket = new WebSocket(
        `${GEMINI_LIVE_WEBSOCKET_ENDPOINT}?access_token=${encodeURIComponent(payload.token)}`,
      );
      websocketRef.current = websocket;
      websocket.onopen = () => {
        websocket.send(
          JSON.stringify({
            setup: {
              model: payload.model,
              responseModalities: ["AUDIO"],
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              systemInstruction: {
                parts: [{ text: GEMINI_LIVE_SYSTEM_INSTRUCTION }],
              },
            },
          }),
        );
      };
      websocket.onmessage = (event) => {
        try {
          handleServerMessage(JSON.parse(event.data as string) as LiveServerMessage);
        } catch {
          setError("Gemini Live trả về dữ liệu không hợp lệ.");
        }
      };
      websocket.onerror = () => {
        setError("Kết nối thoại bị gián đoạn. Vui lòng mở lại phiên.");
      };
      websocket.onclose = () => {
        stopMicrophone();
        websocketRef.current = null;
        if (!closingRef.current) {
          setStatus("error");
          setError("Phiên thoại đã kết thúc. Nhấn bắt đầu để kết nối lại.");
        }
      };
    } catch (caughtError) {
      stopMicrophone();
      const outputContext = outputContextRef.current;
      outputContextRef.current = null;
      if (outputContext) void outputContext.close();
      setStatus("error");
      setError(
        caughtError instanceof DOMException && caughtError.name === "NotAllowedError"
          ? "Cần cho phép sử dụng micro để trò chuyện trực tiếp."
          : caughtError instanceof Error
            ? caughtError.message
            : "Chưa thể mở phiên thoại trực tiếp.",
      );
    }
  }, [handleServerMessage, status, stopMicrophone]);

  useEffect(() => stopSession, [stopSession]);

  const isActive = status === "connecting" || status === "listening";
  const statusLabel =
    status === "connecting"
      ? "Đang kết nối"
      : status === "listening"
        ? "Đang lắng nghe"
        : status === "error"
          ? "Cần kết nối lại"
          : "Sẵn sàng";

  return (
    <section
      aria-labelledby="gemini-live-title"
      className="hidden bg-[var(--color-surface-dark)] pt-[var(--space-section-compact)] text-[var(--color-text-inverse)] lg:block"
    >
      <div className="mx-auto max-w-7xl px-[var(--space-container)] sm:px-[var(--space-container-sm)] lg:px-[var(--space-container-lg)]">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border-dark)] bg-[var(--color-surface-dark-soft)] p-[var(--space-card)] sm:p-[var(--space-card-lg)]">
          <div className="flex flex-col gap-[var(--space-stack)] sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                <Radio className="h-4 w-4" aria-hidden="true" />
                Gemini Live
              </p>
              <h2 id="gemini-live-title" className="mt-2 text-2xl font-bold sm:text-3xl">
                Nói trực tiếp với trợ lý tư vấn
              </h2>
              <p className="mt-3 leading-7 text-[var(--color-text-dark-muted)]">
                Trao đổi bằng giọng nói theo thời gian thực về cửa cổng, cầu thang,
                mái che, nội thất và cải tạo dân dụng.
              </p>
            </div>
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-border-dark)] px-3 py-1.5 text-sm font-semibold text-[var(--color-primary-soft-text)]"
              role="status"
              aria-live="polite"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${status === "listening" ? "animate-pulse bg-emerald-400" : "bg-[var(--color-primary)]"}`}
                aria-hidden="true"
              />
              {statusLabel}
            </span>
          </div>

          <div className="mt-[var(--space-stack)] grid gap-[var(--space-stack)] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-dark)] p-[var(--space-control)]">
              <p className="font-bold">Cách sử dụng</p>
              <ol className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-text-dark-muted)]">
                <li>1. Nhấn “Bắt đầu trò chuyện”.</li>
                <li>2. Cho phép trình duyệt sử dụng micro.</li>
                <li>3. Nói tự nhiên; có thể ngắt lời Gemini khi cần.</li>
              </ol>
              <button
                type="button"
                onClick={isActive ? stopSession : startSession}
                disabled={status === "connecting"}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-3 font-bold text-[var(--color-primary-contrast)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-dark-soft)] disabled:cursor-wait disabled:opacity-70"
              >
                {isActive ? (
                  <PhoneOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Mic className="h-5 w-5" aria-hidden="true" />
                )}
                {status === "connecting"
                  ? "Đang mở phiên..."
                  : isActive
                    ? "Kết thúc"
                    : "Bắt đầu trò chuyện"}
              </button>
            </div>

            <div
              className="min-h-44 rounded-[var(--radius-lg)] border border-[var(--color-border-dark)] p-[var(--space-control)]"
              aria-live="polite"
            >
              <p className="flex items-center gap-2 font-bold">
                <Volume2 className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
                Nội dung đang trao đổi
              </p>
              {userTranscript || assistantTranscript ? (
                <div className="mt-4 space-y-3 text-sm leading-6">
                  {userTranscript ? (
                    <p className="rounded-[var(--radius-md)] bg-black/15 p-3 text-[var(--color-text-dark-muted)]">
                      <strong className="text-[var(--color-text-inverse)]">Bạn:</strong>{" "}
                      {userTranscript}
                    </p>
                  ) : null}
                  {assistantTranscript ? (
                    <p className="rounded-[var(--radius-md)] border border-[var(--color-primary)]/40 bg-[var(--color-primary-soft)] p-3 text-[var(--color-primary-soft-text)]">
                      <strong>Trợ lý:</strong> {assistantTranscript}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-[var(--color-text-dark-subtle)]">
                  Phụ đề cuộc trò chuyện sẽ xuất hiện tại đây sau khi kết nối.
                </p>
              )}
              {error ? (
                <p className="mt-4 rounded-[var(--radius-md)] border border-red-400/50 bg-red-950/30 p-3 text-sm text-red-100" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[var(--color-text-dark-subtle)]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            API key không được gửi xuống trình duyệt. Đại Hải Phát không lưu bản ghi
            âm thanh trong tính năng này; hãy kết thúc phiên khi trao đổi xong.
          </p>
        </div>
      </div>
    </section>
  );
}
