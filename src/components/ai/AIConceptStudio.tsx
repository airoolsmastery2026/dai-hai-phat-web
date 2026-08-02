"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ImageIcon,
  LoaderCircle,
  RotateCcw,
  UploadCloud,
  WandSparkles,
} from "lucide-react";
import NextImage from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import {
  AI_CONCEPT_VIEWS,
  type AIConceptView,
} from "@/lib/ai/concept-studio";

type ViewStatus = "idle" | "running" | "success" | "error";

interface ViewResult {
  status: ViewStatus;
  imageBase64?: string;
  mimeType?: string;
  error?: string;
}

interface GeneratedImage {
  imageBase64: string;
  mimeType: string;
}

interface SourceImage {
  file: File;
  previewUrl: string;
}

interface OptimizedInputs {
  siteSource: File;
  referenceSource: File;
  siteImage: File;
  referenceImage: File;
}

interface GenerateResponse {
  imageBase64?: unknown;
  mimeType?: unknown;
  error?: unknown;
}

interface AIConceptStudioProps {
  enabled: boolean;
}

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const MAX_EDGE = 1_600;
const TARGET_BYTES = 2_000_000;
const INITIAL_QUALITY = 0.82;
const FALLBACK_QUALITY = 0.66;

function createInitialResults(): Record<AIConceptView, ViewResult> {
  return {
    front: { status: "idle" },
    left: { status: "idle" },
    right: { status: "idle" },
    detail: { status: "idle" },
  };
}

async function loadBrowserImage(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);

  try {
    return await new Promise((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Không thể đọc tệp ảnh."));
      image.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Không thể tối ưu ảnh."));
      },
      "image/jpeg",
      quality,
    );
  });
}

async function optimizeImage(file: File): Promise<File> {
  const image = await loadBrowserImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");

  const surfaceColor = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--color-surface")
    .trim();
  if (surfaceColor) {
    context.fillStyle = surfaceColor;
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(image, 0, 0, width, height);

  let blob = await canvasToBlob(canvas, INITIAL_QUALITY);
  if (blob.size > TARGET_BYTES) {
    blob = await canvasToBlob(canvas, FALLBACK_QUALITY);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}-optimized.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

function base64ToFile(
  imageBase64: string,
  mimeType: string,
  fileName: string,
): File {
  const binary = window.atob(imageBase64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], fileName, { type: mimeType });
}

function validateSourceFile(file: File): string | null {
  if (!ACCEPTED_TYPES.has(file.type)) {
    return "Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.";
  }

  if (file.size > MAX_SOURCE_BYTES) {
    return "Ảnh gốc vượt quá 10 MB. Vui lòng chọn ảnh nhỏ hơn.";
  }

  return null;
}

function downloadExtension(mimeType: string): string {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  return "png";
}

interface ImageInputProps {
  id: string;
  node: string;
  title: string;
  description: string;
  source: SourceImage | null;
  disabled: boolean;
  onChange: (file: File) => void;
}

function ImageInput({
  id,
  node,
  title,
  description,
  source,
  disabled,
  onChange,
}: ImageInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) onChange(selectedFile);
    event.target.value = "";
  };

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-4)]">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-metal-strong)]">
          {node}
        </p>
        <h2 className="mt-[var(--space-2)] text-lg font-bold text-[var(--color-text)]">
          {title}
        </h2>
        <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>

      <div className="p-[var(--space-4)]">
        <div className="relative aspect-video overflow-hidden rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-background)]">
          {source ? (
            <NextImage
              src={source.previewUrl}
              alt={`Xem trước ${title.toLowerCase()}`}
              fill
              unoptimized
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-[var(--space-2)] p-[var(--space-4)] text-center text-[var(--color-text-muted)]">
              <ImageIcon className="h-8 w-8" aria-hidden="true" />
              <span className="text-sm font-semibold">Chưa chọn ảnh</span>
            </div>
          )}
        </div>

        <label
          htmlFor={id}
          className={`mt-[var(--space-4)] inline-flex min-h-[var(--control-min-size)] w-full cursor-pointer items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)] text-sm font-bold text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-within:ring-2 focus-within:ring-[var(--color-focus)] focus-within:ring-offset-2 ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <UploadCloud className="h-5 w-5" aria-hidden="true" />
          {source ? "Đổi ảnh" : "Chọn ảnh"}
          <input
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={disabled}
            onChange={handleChange}
          />
        </label>

        <p className="mt-[var(--space-2)] truncate text-xs text-[var(--color-text-subtle)]">
          {source ? source.file.name : "JPG, PNG hoặc WEBP · tối đa 10 MB"}
        </p>
      </div>
    </Card>
  );
}

interface ResultCardProps {
  view: (typeof AI_CONCEPT_VIEWS)[number];
  result: ViewResult;
  disabled: boolean;
  onRun: () => void;
}

function ResultCard({ view, result, disabled, onRun }: ResultCardProps) {
  const imageUrl =
    result.imageBase64 && result.mimeType
      ? `data:${result.mimeType};base64,${result.imageBase64}`
      : null;

  const handleDownload = () => {
    if (!imageUrl || !result.mimeType) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `dai-hai-phat-${view.id}.${downloadExtension(result.mimeType)}`;
    link.click();
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-[var(--space-3)] border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-4)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-metal-strong)]">
            {view.node}
          </p>
          <h3 className="mt-[var(--space-2)] font-bold text-[var(--color-text)]">
            {view.title}
          </h3>
        </div>
        <span
          className={`rounded-full px-[var(--space-3)] py-[var(--space-1)] text-xs font-bold ${
            result.status === "success"
              ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
              : result.status === "error"
                ? "bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
                : result.status === "running"
                  ? "bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
                  : "bg-[var(--color-surface-strong)] text-[var(--color-text-muted)]"
          }`}
        >
          {result.status === "success"
            ? "Hoàn tất"
            : result.status === "error"
              ? "Có lỗi"
              : result.status === "running"
                ? "Đang dựng"
                : "Sẵn sàng"}
        </span>
      </div>

      <div className="p-[var(--space-4)]">
        <div
          className="relative aspect-video overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)]"
          aria-busy={result.status === "running" || undefined}
        >
          {imageUrl ? (
            <NextImage
              src={imageUrl}
              alt={`${view.title} do AI tạo`}
              fill
              unoptimized
              sizes="(min-width: 1280px) 50vw, 100vw"
              className="object-cover"
            />
          ) : result.status === "running" ? (
            <div className="flex h-full flex-col items-center justify-center gap-[var(--space-3)] text-[var(--color-primary)]">
              <LoaderCircle className="h-8 w-8 animate-spin" aria-hidden="true" />
              <p className="text-sm font-bold">AI đang dựng phối cảnh</p>
            </div>
          ) : result.status === "error" ? (
            <div className="flex h-full flex-col items-center justify-center gap-[var(--space-3)] p-[var(--space-4)] text-center text-[var(--color-danger)]">
              <AlertTriangle className="h-8 w-8" aria-hidden="true" />
              <p className="text-sm font-semibold">{result.error}</p>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-[var(--space-2)] p-[var(--space-4)] text-center text-[var(--color-text-muted)]">
              <ImageIcon className="h-8 w-8" aria-hidden="true" />
              <p className="text-sm font-semibold">{view.description}</p>
            </div>
          )}
        </div>

        <div className="mt-[var(--space-4)] grid grid-cols-1 gap-[var(--space-2)] sm:grid-cols-2">
          <button
            type="button"
            disabled={disabled}
            onClick={onRun}
            className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] py-[var(--space-3)] text-sm font-bold text-[var(--color-primary-contrast)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {result.status === "success" ? "Tạo lại góc này" : "Tạo góc này"}
          </button>

          <button
            type="button"
            disabled={!imageUrl || disabled}
            onClick={handleDownload}
            className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)] text-sm font-bold text-[var(--color-primary)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Tải ảnh
          </button>
        </div>
      </div>
    </Card>
  );
}

export function AIConceptStudio({ enabled }: AIConceptStudioProps) {
  const [siteSource, setSiteSource] = useState<SourceImage | null>(null);
  const [referenceSource, setReferenceSource] =
    useState<SourceImage | null>(null);
  const [brief, setBrief] = useState("");
  const [results, setResults] = useState(createInitialResults);
  const [busy, setBusy] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const optimizedInputsRef = useRef<OptimizedInputs | null>(null);
  const previewUrlsRef = useRef(new Set<string>());

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.clear();
    };
  }, []);

  const resetOutputs = () => {
    setResults(createInitialResults());
    optimizedInputsRef.current = null;
    setGlobalError(null);
  };

  const replaceSource = (
    file: File,
    current: SourceImage | null,
    setter: (source: SourceImage) => void,
  ) => {
    const error = validateSourceFile(file);
    if (error) {
      setGlobalError(error);
      return;
    }

    if (current) {
      URL.revokeObjectURL(current.previewUrl);
      previewUrlsRef.current.delete(current.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.add(previewUrl);
    setter({ file, previewUrl });
    resetOutputs();
  };

  const setViewResult = (view: AIConceptView, nextResult: ViewResult) => {
    setResults((current) => ({ ...current, [view]: nextResult }));
  };

  const validateInputs = () => {
    if (!enabled) return "Máy chủ chưa được cấu hình Gemini API.";
    if (!siteSource || !referenceSource) {
      return "Hãy chọn đủ ảnh hiện trạng và ảnh mẫu tham khảo.";
    }
    if (brief.trim().length < 20) {
      return "Hãy mô tả hạng mục, kích thước hoặc yêu cầu dự án rõ hơn.";
    }
    return null;
  };

  const prepareInputs = async (): Promise<OptimizedInputs> => {
    if (!siteSource || !referenceSource) {
      throw new Error("Thiếu ảnh đầu vào.");
    }

    const cached = optimizedInputsRef.current;
    if (
      cached?.siteSource === siteSource.file &&
      cached.referenceSource === referenceSource.file
    ) {
      return cached;
    }

    const [optimizedSite, optimizedReference] = await Promise.all([
      optimizeImage(siteSource.file),
      optimizeImage(referenceSource.file),
    ]);

    const prepared = {
      siteSource: siteSource.file,
      referenceSource: referenceSource.file,
      siteImage: optimizedSite,
      referenceImage: optimizedReference,
    };
    optimizedInputsRef.current = prepared;
    return prepared;
  };

  const generateView = async (
    view: AIConceptView,
    inputs: OptimizedInputs,
    baseConcept?: File,
  ): Promise<GeneratedImage | null> => {
    setViewResult(view, { status: "running" });

    try {
      const formData = new FormData();
      formData.set("view", view);
      formData.set("brief", brief.trim());
      formData.set("siteImage", inputs.siteImage);
      formData.set("referenceImage", inputs.referenceImage);
      if (baseConcept) formData.set("baseConcept", baseConcept);

      const response = await fetch("/api/ai/concept", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as GenerateResponse;

      if (
        !response.ok ||
        typeof payload.imageBase64 !== "string" ||
        typeof payload.mimeType !== "string"
      ) {
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "Không thể tạo phối cảnh ở góc này.",
        );
      }

      const generated = {
        imageBase64: payload.imageBase64,
        mimeType: payload.mimeType,
      };
      setViewResult(view, { status: "success", ...generated });
      return generated;
    } catch (error) {
      setViewResult(view, {
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Không thể tạo phối cảnh. Vui lòng thử lại.",
      });
      return null;
    }
  };

  const runAll = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setGlobalError(validationError);
      return;
    }

    setBusy(true);
    setGlobalError(null);

    try {
      const inputs = await prepareInputs();
      const front = await generateView("front", inputs);
      if (!front) return;

      const baseConcept = base64ToFile(
        front.imageBase64,
        front.mimeType,
        "dai-hai-phat-base-concept.png",
      );

      await Promise.allSettled([
        generateView("left", inputs, baseConcept),
        generateView("right", inputs, baseConcept),
        generateView("detail", inputs, baseConcept),
      ]);
    } catch (error) {
      setGlobalError(
        error instanceof Error
          ? error.message
          : "Không thể chuẩn bị ảnh để tạo phối cảnh.",
      );
    } finally {
      setBusy(false);
    }
  };

  const runSelected = async (view: AIConceptView) => {
    const validationError = validateInputs();
    if (validationError) {
      setGlobalError(validationError);
      return;
    }

    setBusy(true);
    setGlobalError(null);

    try {
      const inputs = await prepareInputs();
      if (view === "front") {
        await generateView("front", inputs);
        return;
      }

      let front =
        results.front.status === "success" &&
        results.front.imageBase64 &&
        results.front.mimeType
          ? {
              imageBase64: results.front.imageBase64,
              mimeType: results.front.mimeType,
            }
          : null;

      if (!front) front = await generateView("front", inputs);
      if (!front) return;

      const baseConcept = base64ToFile(
        front.imageBase64,
        front.mimeType,
        "dai-hai-phat-base-concept.png",
      );
      await generateView(view, inputs, baseConcept);
    } catch (error) {
      setGlobalError(
        error instanceof Error
          ? error.message
          : "Không thể chuẩn bị ảnh để tạo phối cảnh.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-[var(--space-8)]">
      {!enabled ? (
        <Alert title="Công cụ chưa sẵn sàng" tone="warning">
          Máy chủ cần biến môi trường GEMINI_API_KEY trước khi khách hàng có thể
          tạo phối cảnh trực tiếp trên website.
        </Alert>
      ) : null}

      {globalError ? (
        <Alert title="Chưa thể tiếp tục" tone="error">
          {globalError}
        </Alert>
      ) : null}

      <section aria-labelledby="ai-concept-inputs-title">
        <div className="mb-[var(--space-5)]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-metal-strong)]">
            Bước 1 · Dữ liệu đầu vào
          </p>
          <h2
            id="ai-concept-inputs-title"
            className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]"
          >
            Chuẩn bị hiện trạng và mẫu tham khảo
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-5)] lg:grid-cols-2">
          <ImageInput
            id="site-image"
            node="Node A"
            title="Ảnh hiện trạng"
            description="Ảnh mặt tiền, cổng, cầu thang, phòng hoặc khu vực cần thiết kế."
            source={siteSource}
            disabled={busy}
            onChange={(file) =>
              replaceSource(file, siteSource, setSiteSource)
            }
          />
          <ImageInput
            id="reference-image"
            node="Node B"
            title="Ảnh mẫu tham khảo"
            description="Mẫu kiểu dáng, vật liệu, màu sắc hoặc phong cách khách hàng mong muốn."
            source={referenceSource}
            disabled={busy}
            onChange={(file) =>
              replaceSource(file, referenceSource, setReferenceSource)
            }
          />
        </div>
      </section>

      <section aria-labelledby="ai-concept-brief-title">
        <Card className="p-[var(--space-5)] sm:p-[var(--space-6)]">
          <label
            id="ai-concept-brief-title"
            htmlFor="project-brief"
            className="text-lg font-bold text-[var(--color-text)]"
          >
            Thông tin dự án
          </label>
          <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
            Ghi rõ hạng mục, kích thước, vật liệu, màu sắc và phần hiện trạng cần
            giữ nguyên. AI không tự xác nhận kích thước hoặc báo giá.
          </p>
          <textarea
            id="project-brief"
            value={brief}
            disabled={busy}
            maxLength={4_000}
            rows={8}
            onChange={(event) => setBrief(event.target.value)}
            placeholder="Ví dụ: Cổng sắt hai cánh rộng 3,6 m, cao 2,4 m; sắt hộp sơn tĩnh điện đen nhám; phong cách hiện đại; giữ nguyên hai cột và tường rào hiện tại..."
            className="mt-[var(--space-4)] w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] text-base leading-7 text-[var(--color-text)] outline-none transition-colors duration-[var(--duration-fast)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-60"
          />
          <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-3)] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--color-text-subtle)]">
              {brief.length}/4.000 ký tự · tối thiểu 20 ký tự
            </p>
            <button
              type="button"
              disabled={busy || !enabled}
              onClick={runAll}
              className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-6)] py-[var(--space-3)] text-sm font-bold text-[var(--color-primary-contrast)] shadow-[var(--shadow-md)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              aria-busy={busy || undefined}
            >
              {busy ? (
                <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <WandSparkles className="h-5 w-5" aria-hidden="true" />
              )}
              {busy ? "Đang tạo phối cảnh" : "Tạo toàn bộ 4 góc"}
            </button>
          </div>
        </Card>
      </section>

      <section aria-labelledby="ai-concept-results-title">
        <div className="mb-[var(--space-5)]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-metal-strong)]">
            Bước 2 · Nano Banana Pro
          </p>
          <h2
            id="ai-concept-results-title"
            className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]"
          >
            Bốn góc của cùng một phương án
          </h2>
          <p className="mt-[var(--space-3)] max-w-[var(--content-max)] text-sm leading-6 text-[var(--color-text-muted)]">
            C1 được tạo trước làm phương án chuẩn. C2, C3 và C4 nhận thêm ảnh C1
            để giữ kiểu dáng, màu sắc và vật liệu nhất quán.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-5)] xl:grid-cols-2">
          {AI_CONCEPT_VIEWS.map((view) => (
            <ResultCard
              key={view.id}
              view={view}
              result={results[view.id]}
              disabled={busy || !enabled}
              onRun={() => runSelected(view.id)}
            />
          ))}
        </div>
      </section>

      <Alert title="Phạm vi sử dụng" tone="info">
        <div className="flex gap-[var(--space-3)]">
          <CheckCircle2
            className="mt-[var(--space-1)] h-5 w-5 shrink-0 text-[var(--color-success)]"
            aria-hidden="true"
          />
          <p>
            Hình ảnh AI chỉ dùng để tư vấn ý tưởng. Kích thước, vật liệu, kết
            cấu và báo giá chính thức phải được Đại Hải Phát xác nhận sau khi
            khảo sát thực tế.
          </p>
        </div>
      </Alert>
    </div>
  );
}
