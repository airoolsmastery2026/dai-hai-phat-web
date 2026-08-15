"use client";

import {
  ImageIcon,
  LoaderCircle,
  Play,
  RotateCcw,
  UploadCloud,
  WandSparkles,
} from "lucide-react";
import NextImage from "next/image";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { buildCrossfadeVideo } from "@/lib/media/crossfade";

interface RawFinishedRevealStudioProps {
  enabled: boolean;
}

type RevealTarget = "raw" | "finished";

interface GeneratedImage {
  imageBase64: string;
  mimeType: string;
}

interface GenerateResponse {
  imageBase64?: unknown;
  mimeType?: unknown;
  error?: unknown;
}

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SOURCE_BYTES = 2_200_000;

function imageDataUrl(image: GeneratedImage): string {
  return `data:${image.mimeType};base64,${image.imageBase64}`;
}

export function RawFinishedRevealStudio({ enabled }: RawFinishedRevealStudioProps) {
  const [source, setSource] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [brief, setBrief] = useState("");
  const [rawImage, setRawImage] = useState<GeneratedImage | null>(null);
  const [finishedImage, setFinishedImage] = useState<GeneratedImage | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [videoBusy, setVideoBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  }, [sourceUrl]);

  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  }, [videoUrl]);

  const canGenerate = enabled && Boolean(source) && !busy;
  const canCrossfade = Boolean(rawImage && finishedImage) && !videoBusy;
  const rawUrl = useMemo(() => rawImage ? imageDataUrl(rawImage) : null, [rawImage]);
  const finishedUrl = useMemo(
    () => finishedImage ? imageDataUrl(finishedImage) : null,
    [finishedImage],
  );

  const resetOutputs = () => {
    setRawImage(null);
    setFinishedImage(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setError(null);
  };

  const handleSource = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError("Ảnh vượt quá 2,2 MB. Hãy giảm dung lượng trước khi tải lên.");
      return;
    }
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSource(file);
    setSourceUrl(URL.createObjectURL(file));
    resetOutputs();
  };

  const generateTarget = async (target: RevealTarget): Promise<GeneratedImage> => {
    if (!source) throw new Error("Chưa có ảnh nguồn.");
    const formData = new FormData();
    formData.set("target", target);
    formData.set("brief", brief.trim());
    formData.set("sourceImage", source);
    const response = await fetch("/api/ai/raw-finished", { method: "POST", body: formData });
    const payload = (await response.json()) as GenerateResponse;
    if (!response.ok) {
      throw new Error(typeof payload.error === "string" ? payload.error : "Không thể dựng ảnh.");
    }
    if (typeof payload.imageBase64 !== "string" || typeof payload.mimeType !== "string") {
      throw new Error("Dịch vụ không trả về ảnh hợp lệ.");
    }
    return { imageBase64: payload.imageBase64, mimeType: payload.mimeType };
  };

  const generatePair = async () => {
    if (!source) return;
    setBusy(true);
    setError(null);
    resetOutputs();
    try {
      const [raw, finished] = await Promise.all([
        generateTarget("raw"),
        generateTarget("finished"),
      ]);
      setRawImage(raw);
      setFinishedImage(finished);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Không thể dựng ảnh.");
    } finally {
      setBusy(false);
    }
  };

  const generateCrossfade = async () => {
    if (!rawImage || !finishedImage) return;
    setVideoBusy(true);
    setError(null);
    try {
      const blob = await buildCrossfadeVideo(rawImage, finishedImage);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setVideoUrl(URL.createObjectURL(blob));
    } catch (videoError) {
      setError(videoError instanceof Error ? videoError.message : "Không thể dựng chuyển cảnh.");
    } finally {
      setVideoBusy(false);
    }
  };

  return (
    <section className="space-y-[var(--space-5)]" aria-labelledby="raw-finished-title">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-metal-strong)]">
          Module · Thô → Hoàn thiện
        </p>
        <h2 id="raw-finished-title" className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]">
          Tạo cặp ảnh before/after và preview chuyển cảnh
        </h2>
        <p className="mt-[var(--space-2)] max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">
          Tải một ảnh hiện trạng hoặc ảnh hoàn thiện. AI dựng hai trạng thái cùng góc máy; chuyển cảnh Crossfade được tạo ngay trên thiết bị và không cần thêm API video.
        </p>
      </div>

      {!enabled ? (
        <Alert title="Công cụ chưa sẵn sàng" tone="warning">
          Gemini chưa được cấu hình trên máy chủ. Không có API key nào được nhập hoặc lưu trên trình duyệt.
        </Alert>
      ) : null}
      {error ? <Alert title="Chưa thể hoàn tất" tone="warning">{error}</Alert> : null}

      <div className="grid gap-[var(--space-4)] lg:grid-cols-2">
        <Card className="p-[var(--space-4)]">
          <div className="relative aspect-video overflow-hidden rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-background)]">
            {sourceUrl ? (
              <NextImage src={sourceUrl} alt="Ảnh nguồn" fill unoptimized sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-[var(--space-2)] text-[var(--color-text-muted)]">
                <ImageIcon className="h-8 w-8" aria-hidden="true" />
                <span className="text-sm font-semibold">Chưa chọn ảnh nguồn</span>
              </div>
            )}
          </div>
          <label className="mt-[var(--space-4)] inline-flex min-h-[var(--control-min-size)] w-full cursor-pointer items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-4)] py-[var(--space-3)] text-sm font-bold text-[var(--color-primary)]">
            <UploadCloud className="h-5 w-5" aria-hidden="true" />
            {source ? "Đổi ảnh" : "Chọn ảnh"}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={handleSource} />
          </label>
          <textarea
            value={brief}
            onChange={(event) => setBrief(event.target.value.slice(0, 2000))}
            rows={4}
            maxLength={2000}
            placeholder="Mô tả ngắn phong cách, vật liệu hoặc hạng mục cần hoàn thiện…"
            className="mt-[var(--space-4)] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-3)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-focus)]"
          />
          <button type="button" disabled={!canGenerate} onClick={generatePair} className="mt-[var(--space-4)] inline-flex min-h-[var(--control-min-size)] w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] py-[var(--space-3)] text-sm font-bold text-[var(--color-primary-contrast)] disabled:cursor-not-allowed disabled:opacity-60">
            {busy ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <WandSparkles className="h-5 w-5" aria-hidden="true" />}
            {busy ? "Đang dựng hai trạng thái…" : "Dựng Thô + Hoàn thiện"}
          </button>
        </Card>

        <Card className="p-[var(--space-4)]">
          <div className="grid gap-[var(--space-3)] sm:grid-cols-2">
            {[{ label: "THÔ", url: rawUrl }, { label: "HOÀN THIỆN", url: finishedUrl }].map((item) => (
              <div key={item.label}>
                <p className="mb-[var(--space-2)] text-xs font-bold tracking-[0.12em] text-[var(--color-text-muted)]">{item.label}</p>
                <div className="relative aspect-video overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)]">
                  {item.url ? <NextImage src={item.url} alt={`Bản xem trước ${item.label.toLowerCase()}`} fill unoptimized sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" /> : <div className="flex h-full items-center justify-center text-[var(--color-text-subtle)]"><ImageIcon className="h-7 w-7" aria-hidden="true" /></div>}
                </div>
              </div>
            ))}
          </div>

          <button type="button" disabled={!canCrossfade} onClick={generateCrossfade} className="mt-[var(--space-4)] inline-flex min-h-[var(--control-min-size)] w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)] text-sm font-bold text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60">
            {videoBusy ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Play className="h-5 w-5" aria-hidden="true" />}
            {videoBusy ? "Đang tạo chuyển cảnh…" : "Tạo Crossfade miễn phí"}
          </button>

          {videoUrl ? (
            <video className="mt-[var(--space-4)] w-full rounded-[var(--radius-md)] border border-[var(--color-border)]" src={videoUrl} controls playsInline preload="metadata" aria-label="Preview chuyển cảnh từ thô sang hoàn thiện" />
          ) : null}

          {(rawImage || finishedImage) ? (
            <button type="button" onClick={resetOutputs} className="mt-[var(--space-3)] inline-flex min-h-[var(--control-min-size)] w-full items-center justify-center gap-[var(--space-2)] text-sm font-bold text-[var(--color-text-muted)]">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Xóa kết quả và dựng lại
            </button>
          ) : null}
        </Card>
      </div>
    </section>
  );
}
