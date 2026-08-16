"use client";

import { CheckCircle2, Copy, Film, Link2, Upload, Youtube } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { VideoPlayer } from "@/components/video/VideoPlayer";
import {
  getYouTubeVideoId,
  isSafeHostedVideoUrl,
} from "@/lib/video/source";
import {
  VIDEO_STORAGE_STATUS,
  validateLocalVideoCandidate,
} from "@/lib/video/storage";
import type { VideoRecord, VideoSource } from "@/lib/video/types";

type SourceMode = "youtube" | "hosted" | "file";

export function AdminVideoManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<SourceMode>("youtube");
  const [title, setTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [localPreview, setLocalPreview] = useState<{ name: string; url: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => () => {
    if (localPreview?.url) URL.revokeObjectURL(localPreview.url);
  }, [localPreview]);

  const source: VideoSource = mode === "youtube" ? "youtube" : "upload";
  const validSource = mode === "youtube"
    ? Boolean(getYouTubeVideoId(sourceUrl))
    : mode === "hosted"
      ? isSafeHostedVideoUrl(sourceUrl)
      : Boolean(localPreview);

  const previewRecord = useMemo<VideoRecord | null>(() => {
    const url = mode === "file" ? localPreview?.url : sourceUrl.trim();
    if (!url || !validSource || title.trim().length < 3) return null;
    return {
      id: "preview",
      source,
      title: title.trim(),
      sourceUrl: url,
      posterUrl: posterUrl.trim() || undefined,
      featured: false,
      order: 0,
      status: "draft",
    };
  }, [localPreview, mode, posterUrl, source, sourceUrl, title, validSource]);

  const recordJson = previewRecord && mode !== "file"
    ? JSON.stringify({ ...previewRecord, id: "video-cong-trinh-01" }, null, 2)
    : null;

  function chooseLocalFile(file: File) {
    const error = validateLocalVideoCandidate(file);
    if (error) {
      setMessage(error);
      return;
    }
    if (localPreview?.url) URL.revokeObjectURL(localPreview.url);
    setLocalPreview({ name: file.name, url: URL.createObjectURL(file) });
    setTitle((current) => current || file.name.replace(/\.[^.]+$/, ""));
    setMessage(VIDEO_STORAGE_STATUS.message);
  }

  async function copyRecord() {
    if (!recordJson) return;
    await navigator.clipboard.writeText(recordJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const tabs: Array<{ id: SourceMode; label: string; icon: typeof Youtube }> = [
    { id: "youtube", label: "Link YouTube", icon: Youtube },
    { id: "hosted", label: "URL video", icon: Link2 },
    { id: "file", label: "Video từ thiết bị", icon: Upload },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Khu vực quản trị · Video</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Chuẩn bị video công trình</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Kiểm tra video trước khi công bố. Link YouTube được chuẩn hóa sang chế độ nhúng tăng riêng tư; video đã lưu ở kho ngoài được phát bằng trình phát của trình duyệt.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <p className="font-bold">Trạng thái lưu trữ video</p>
        <p>{VIDEO_STORAGE_STATUS.message}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Nguồn video">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => { setMode(id); setMessage(null); }}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${mode === id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}
          >
            <Icon className="size-4" aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block text-sm font-bold text-slate-800">
            Tiêu đề video
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              placeholder="Ví dụ: Hoàn thiện cửa cổng nhà phố"
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm"
            />
          </label>

          {mode !== "file" ? (
            <label className="block text-sm font-bold text-slate-800">
              {mode === "youtube" ? "Link YouTube" : "URL file video công khai"}
              <input
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                inputMode="url"
                placeholder={mode === "youtube" ? "https://youtu.be/..." : "https://cdn.example.com/video.mp4"}
                className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm"
              />
              {sourceUrl ? (
                <span className={`mt-2 block text-xs font-semibold ${validSource ? "text-emerald-700" : "text-red-700"}`}>
                  {validSource ? "Đường dẫn hợp lệ" : "Đường dẫn chưa đúng định dạng hỗ trợ"}
                </span>
              ) : null}
            </label>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center hover:border-amber-600"
              >
                <Upload className="size-6 text-slate-600" aria-hidden="true" />
                <span className="mt-2 font-bold text-slate-900">Chọn video để xem thử</span>
                <span className="mt-1 text-xs text-slate-500">MP4, WebM hoặc MOV · tối đa 200 MB ở bước xem thử</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) chooseLocalFile(file);
                  event.target.value = "";
                }}
              />
              {localPreview ? <p className="mt-2 truncate text-xs font-semibold text-slate-600">{localPreview.name}</p> : null}
            </div>
          )}

          {mode !== "file" ? (
            <label className="block text-sm font-bold text-slate-800">
              Ảnh bìa tùy chọn
              <input
                value={posterUrl}
                onChange={(event) => setPosterUrl(event.target.value)}
                inputMode="url"
                placeholder="Đường dẫn ảnh bìa đã được duyệt"
                className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm"
              />
            </label>
          ) : null}

          {message ? <p role="status" className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p> : null}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 text-sm font-bold text-slate-800">
            <Film className="size-4" aria-hidden="true" /> Bản xem trước 16:9
          </div>
          {mode === "file" && localPreview ? (
            <video className="aspect-video w-full bg-black object-contain" src={localPreview.url} controls playsInline preload="metadata" />
          ) : previewRecord ? (
            <VideoPlayer video={previewRecord} />
          ) : (
            <div className="flex aspect-video items-center justify-center bg-slate-100 p-6 text-center text-sm font-semibold text-slate-500">
              Nhập tiêu đề và nguồn video hợp lệ để xem trước.
            </div>
          )}

          {recordJson ? (
            <div className="border-t border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-slate-900">Record chờ duyệt</p>
                <button type="button" onClick={copyRecord} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700">
                  {copied ? <CheckCircle2 className="size-4 text-emerald-700" /> : <Copy className="size-4" />}
                  {copied ? "Đã sao chép" : "Sao chép"}
                </button>
              </div>
              <pre className="mt-3 max-h-52 overflow-auto rounded-xl bg-slate-950 p-3 text-xs leading-5 text-slate-100">{recordJson}</pre>
            </div>
          ) : null}
        </div>
      </div>

      <a href="/admin/media" className="mt-6 inline-flex min-h-11 items-center font-bold text-slate-700 hover:underline">← Quay lại quản lý hình ảnh</a>
    </section>
  );
}
