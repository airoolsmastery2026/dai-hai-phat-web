'use client';

import Link from 'next/link';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, FileClock, FileText, RefreshCw, Upload } from 'lucide-react';

type DocumentItem = {
  id: string;
  filename: string;
  mimeType: string;
  byteSize: number;
  sha256: string;
  extractionStatus: 'extracted' | 'pending_extraction' | 'failed';
  promotedToKnowledge: boolean;
  createdAt: string;
};

type DocumentsResponse = {
  documents?: DocumentItem[];
  document?: DocumentItem;
  duplicate?: boolean;
  error?: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusLabel(status: DocumentItem['extractionStatus']): string {
  if (status === 'extracted') return 'Đã trích text';
  if (status === 'pending_extraction') return 'Chờ extractor';
  return 'Trích xuất lỗi';
}

export default function DhpWorkspaceDocumentInbox() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/workspace/documents', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as DocumentsResponse;
      if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
      setDocuments(payload.documents ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải Document Inbox.');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || busy) return;

    setBusy(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.set('file', file);
      const response = await fetch('/api/admin/workspace/documents', {
        method: 'POST',
        body: formData,
      });
      const payload = (await response.json().catch(() => ({}))) as DocumentsResponse;
      if (!response.ok || !payload.document) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }
      setMessage(
        payload.duplicate
          ? 'Tệp này đã có trong Document Inbox; không lưu bản trùng.'
          : payload.document.extractionStatus === 'extracted'
            ? 'Đã ingest và trích text. Tài liệu vẫn là workspace material, chưa phải DHP Knowledge.'
            : 'Đã ingest raw file. Tài liệu đang chờ extractor và chưa phải DHP Knowledge.',
      );
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể ingest tài liệu.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/admin/workspace" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
              <ArrowLeft className="h-4 w-4" /> DHP Workspace
            </Link>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Đại Hải Phát AI OS</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Document Inbox</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Tiếp nhận tài liệu có provenance vào kho workspace riêng. Upload không tự động biến dữ liệu thành PRODUCT_DB, PRICE_DB, CRM_DB hay DHP Knowledge.
            </p>
          </div>
          <button type="button" onClick={() => void refresh()} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} /> Làm mới
          </button>
        </header>

        {message && <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{message}</div>}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-bold">Ingest tài liệu</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                TXT/MD/CSV/JSON tối đa 512 KB được trích text trực tiếp. PDF/XLS/XLSX/JPG/PNG/WEBP tối đa 4 MB được lưu raw và đánh dấu chờ extractor.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
              <Upload className="h-4 w-4" /> Chọn tệp
              <input
                type="file"
                className="sr-only"
                disabled={busy}
                accept=".txt,.md,.csv,.json,.pdf,.xls,.xlsx,.jpg,.jpeg,.png,.webp,text/plain,text/markdown,text/csv,application/json,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png,image/webp"
                onChange={(event) => void upload(event)}
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">Tài liệu đã ingest</h2>
            <span className="text-xs font-semibold text-slate-500">{documents.length} mục gần nhất</span>
          </div>
          <div className="mt-4 grid gap-3">
            {documents.length === 0 && <p className="text-sm text-slate-500">Chưa có tài liệu trong inbox.</p>}
            {documents.map((document) => (
              <article key={document.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      {document.extractionStatus === 'extracted' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /> : document.extractionStatus === 'pending_extraction' ? <FileClock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /> : <FileText className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" />}
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{document.filename}</p>
                        <p className="mt-1 text-xs text-slate-500">{document.mimeType} · {formatBytes(document.byteSize)}</p>
                      </div>
                    </div>
                  </div>
                  <span className="w-fit rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">{statusLabel(document.extractionStatus)}</span>
                </div>
                <div className="mt-3 grid gap-1 text-xs text-slate-500 sm:grid-cols-3">
                  <p>SHA-256: {document.sha256.slice(0, 12)}…</p>
                  <p>{document.promotedToKnowledge ? 'Đã promote vào Knowledge' : 'Chưa promote vào Knowledge'}</p>
                  <p>{new Date(document.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
