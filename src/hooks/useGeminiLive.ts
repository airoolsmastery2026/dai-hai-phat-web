"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LIVE_ENDPOINT =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained";
const INPUT_SAMPLE_RATE = 16_000;
const DEFAULT_OUTPUT_SAMPLE_RATE = 24_000;

export type GeminiLiveStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "error";

interface LiveTokenResponse {
  token?: string;
  model?: string;
  error?: string;
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
  goAway?: unknown;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return window.btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function downsampleToPcm16(input: Float32Array, inputRate: number): Uint8Array {
  const ratio = inputRate / INPUT_SAMPLE_RATE;
  const outputLength = Math.max(1, Math.floor(input.length / ratio));
  const buffer = new ArrayBuffer(outputLength * 2);
  const view = new DataView(buffer);

  for (let outputIndex = 0; outputIndex < outputLength; outputIndex += 1) {
    const start = Math.floor(outputIndex * ratio);
    const end = Math.min(input.length, Math.floor((outputIndex + 1) * ratio));
    let sum = 0;
    for (let inputIndex = start; inputIndex < end; inputIndex += 1) {
      sum += input[inputIndex];
    }
    const sample = Math.max(-1, Math.min(1, sum / Math.max(1, end - start)));
    view.setInt16(
      outputIndex * 2,
      sample < 0 ? sample * 0x8000 : sample * 0x7fff,
      true,
    );
  }

  return new Uint8Array(buffer);
}

function readSampleRate(mimeType: unknown): number {
  if (typeof mimeType !== "string") return DEFAULT_OUTPUT_SAMPLE_RATE;
  const match = /rate=(\d+)/i.exec(mimeType);
  const parsed = match ? Number(match[1]) : DEFAULT_OUTPUT_SAMPLE_RATE;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_OUTPUT_SAMPLE_RATE;
}

function pcm16ToFloat32(bytes: Uint8Array): Float32Array {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const output = new Float32Array(Math.floor(bytes.byteLength / 2));
  for (let index = 0; index < output.length; index += 1) {
    output[index] = view.getInt16(index * 2, true) / 0x8000;
  }
  return output;
}

export function useGeminiLive() {
  const [status, setStatus] = useState<GeminiLiveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [userTranscript, setUserTranscript] = useState("");
  const [assistantTranscript, setAssistantTranscript] = useState("");

  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextPlaybackTimeRef = useRef(0);
  const stoppingRef = useRef(false);

  const stop = useCallback(() => {
    stoppingRef.current = true;
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    socketRef.current?.close(1000, "User ended Gemini Live session");
    socketRef.current = null;
    void inputContextRef.current?.close();
    void outputContextRef.current?.close();
    inputContextRef.current = null;
    outputContextRef.current = null;
    nextPlaybackTimeRef.current = 0;
    setStatus("idle");
  }, []);

  const playAudio = useCallback(async (data: string, mimeType: unknown) => {
    const context = outputContextRef.current;
    if (!context) return;
    if (context.state === "suspended") await context.resume();

    const bytes = base64ToBytes(data);
    const samples = pcm16ToFloat32(bytes);
    const sampleRate = readSampleRate(mimeType);
    const audioBuffer = context.createBuffer(1, samples.length, sampleRate);
    audioBuffer.getChannelData(0).set(samples);
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    const startAt = Math.max(context.currentTime, nextPlaybackTimeRef.current);
    source.start(startAt);
    nextPlaybackTimeRef.current = startAt + audioBuffer.duration;
    setStatus("speaking");
    source.onended = () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        setStatus("listening");
      }
    };
  }, []);

  const start = useCallback(async () => {
    if (status === "connecting" || status === "listening" || status === "speaking") {
      return;
    }

    setError(null);
    setUserTranscript("");
    setAssistantTranscript("");
    setStatus("connecting");
    stoppingRef.current = false;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Trình duyệt này chưa hỗ trợ microphone cho Gemini Live.");
      }

      const tokenResponse = await fetch("/api/ai/live-token", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
      const tokenPayload = (await tokenResponse.json()) as LiveTokenResponse;
      if (!tokenResponse.ok || !tokenPayload.token || !tokenPayload.model) {
        throw new Error(tokenPayload.error || "Chưa thể mở Gemini Live.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      streamRef.current = stream;

      const inputContext = new AudioContext();
      const outputContext = new AudioContext();
      inputContextRef.current = inputContext;
      outputContextRef.current = outputContext;
      const source = inputContext.createMediaStreamSource(stream);
      const processor = inputContext.createScriptProcessor(4096, 1, 1);
      sourceRef.current = source;
      processorRef.current = processor;

      const websocket = new WebSocket(
        `${LIVE_ENDPOINT}?access_token=${encodeURIComponent(tokenPayload.token)}`,
      );
      socketRef.current = websocket;

      websocket.onopen = () => {
        websocket.send(
          JSON.stringify({
            setup: {
              model: `models/${tokenPayload.model}`,
              responseModalities: ["AUDIO"],
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              systemInstruction: {
                parts: [
                  {
                    text: "Bạn là trợ lý tư vấn của Đại Hải Phát. Chỉ tư vấn ngắn gọn bằng tiếng Việt về cửa cổng, cầu thang, lan can, mái che, nội thất và cải tạo dân dụng. Hỏi từng ý một, không khẳng định giá cuối cùng khi chưa khảo sát. Nhắc người dùng rằng kỹ sư sẽ xác nhận phương án và báo giá.",
                  },
                ],
              },
            },
          }),
        );

        processor.onaudioprocess = (event) => {
          if (websocket.readyState !== WebSocket.OPEN) return;
          const pcm = downsampleToPcm16(
            event.inputBuffer.getChannelData(0),
            inputContext.sampleRate,
          );
          websocket.send(
            JSON.stringify({
              realtimeInput: {
                audio: {
                  data: bytesToBase64(pcm),
                  mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,
                },
              },
            }),
          );
        };
        source.connect(processor);
        processor.connect(inputContext.destination);
      };

      websocket.onmessage = (event) => {
        if (typeof event.data !== "string") return;
        let message: LiveServerMessage;
        try {
          message = JSON.parse(event.data) as LiveServerMessage;
        } catch {
          return;
        }

        if (message.setupComplete) setStatus("listening");
        const content = message.serverContent;
        if (!content) return;
        if (content.interrupted) {
          nextPlaybackTimeRef.current = 0;
          setStatus("listening");
        }
        if (typeof content.inputTranscription?.text === "string") {
          setUserTranscript(content.inputTranscription.text.trim());
        }
        if (typeof content.outputTranscription?.text === "string") {
          setAssistantTranscript(content.outputTranscription.text.trim());
        }
        content.modelTurn?.parts?.forEach((part) => {
          const inlineData = part.inlineData;
          if (typeof inlineData?.data === "string") {
            void playAudio(inlineData.data, inlineData.mimeType);
          }
        });
      };

      websocket.onerror = () => {
        if (stoppingRef.current) return;
        setError("Kết nối Gemini Live gặp lỗi. Hãy thử lại hoặc tiếp tục bằng biểu mẫu chat.");
        setStatus("error");
      };

      websocket.onclose = () => {
        if (stoppingRef.current) return;
        stream.getTracks().forEach((track) => track.stop());
        setError("Phiên Gemini Live đã kết thúc. Anh/chị có thể mở lại hoặc dùng chat bên dưới.");
        setStatus("error");
      };
    } catch (caughtError) {
      stop();
      stoppingRef.current = false;
      setError(
        caughtError instanceof DOMException && caughtError.name === "NotAllowedError"
          ? "Cần cho phép sử dụng microphone để trò chuyện bằng Gemini Live."
          : caughtError instanceof Error
            ? caughtError.message
            : "Chưa thể mở Gemini Live.",
      );
      setStatus("error");
    }
  }, [playAudio, status, stop]);

  useEffect(() => stop, [stop]);

  return {
    status,
    error,
    userTranscript,
    assistantTranscript,
    start,
    stop,
  };
}
