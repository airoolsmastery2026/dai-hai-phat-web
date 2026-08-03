"use client";

import { useMemo, useRef, useState } from "react";

import {
  ADMIN_MEDIA_ALLOWED_TYPES,
  validateAdminMediaCandidates,
} from "@/lib/admin/media-validation";

type StagedMedia = {
  id: string;
  file: File;
  previewUrl: string;
  alt: string;
};

function revoke(items: readonly StagedMedia[]) {
  for (const item of items) URL.revokeObjectURL(item.previewUrl);
}

export function AdminMediaManager() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<StagedMedia[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const accept = useMemo(() => ADMIN_MEDIA_ALLOWED_TYPES.join(","), []);

  function stageFiles(fileList: FileList | readonly File[]) {
    const files = Array.from(fileList);
    const result = validateAdminMediaCandidates(files);
    const acceptedNames = new Set(result.accepted.map((file) => file.name));
    const staged = files
      .filter((file) => acceptedNames.has(file.name))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        alt: "",
      }));

    setItems((current) => [...current, ...staged].slice(0, 12));
    setMessages(result.rejected.map((file) => `${file.name}: ${file.reason}`));
  }

  function removeItem(id: string) {
    setItems((current) => {
      const removed = current.filter((item) => item.id === id);
      revoke(removed);
      return current.filter((item) => item.id !== id);
    });
  }

  function moveItem(targetId: string) {
    if (!draggingId || draggingId === targetId) return;
    setItems((current) => {
      const from = current.findIndex((item) => item.id === draggingId);
      const to = current.findIndex((item) => item.id === targetId);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggingId(null);
  }

  const canSubmit = items.length > 0 && items.every((item) => item.alt.trim().length >= 5);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Khu vực quản trị · Ảnh chờ duyệt
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Quản lý hình ảnh</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Kéo ảnh vào khu vực bên dưới để kiểm tra, nhập mô tả và sắp xếp. Phiên bản này chỉ tạo danh sách chờ duyệt, không tự thay ảnh đang hiển thị trên website.
        </p>
      </div>

      <button
        type="button"
        className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-amber-600 hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          stageFiles(event.dataTransfer.files);
        }}
      >
        <span className="text-lg font-semibold text-slate-900">Kéo-thả ảnh vào đây</span>
        <span className="mt-2 text-sm text-slate-600">JPEG, PNG hoặc WebP · tối đa 8 MB/ảnh · 12 ảnh/lần</span>
      </button>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={accept}
        multiple
        onChange={(event) => {
          if (event.target.files) stageFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {messages.length > 0 ? (
        <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {messages.map((message) => <p key={message}>{message}</p>)}
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={item.id}
            draggable
            onDragStart={() => setDraggingId(item.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => moveItem(item.id)}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Native preview is intentionally limited to local staged files. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.previewUrl} alt="Bản xem trước ảnh chờ duyệt" className="aspect-[4/3] w-full object-cover" />
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">Vị trí {index + 1}</span>
                <button type="button" onClick={() => removeItem(item.id)} className="text-sm font-semibold text-red-700 hover:underline">
                  Loại bỏ
                </button>
              </div>
              <p className="truncate text-sm font-medium text-slate-900" title={item.file.name}>{item.file.name}</p>
              <label className="block text-sm font-medium text-slate-800">
                Mô tả ảnh
                <input
                  value={item.alt}
                  onChange={(event) => {
                    const value = event.target.value;
                    setItems((current) => current.map((currentItem) => currentItem.id === item.id ? { ...currentItem, alt: value } : currentItem));
                  }}
                  maxLength={160}
                  placeholder="Ví dụ: Cổng sắt hộp dân dụng sau thi công"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <p className="text-xs text-slate-500">Kéo thẻ này để thay đổi thứ tự.</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <button
          type="button"
          disabled={!canSubmit}
          className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => setMessages(["Danh sách đã sẵn sàng để gửi sang bước lưu trữ và phê duyệt."])}
        >
          Gửi danh sách chờ duyệt
        </button>
        <p className="text-sm text-slate-600">Mỗi ảnh phải có mô tả ít nhất 5 ký tự.</p>
      </div>
    </section>
  );
}
