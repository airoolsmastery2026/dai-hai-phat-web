'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import {
  Bot,
  Database,
  FileText,
  LayoutDashboard,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const DRAFT_KEY = 'dhp-workspace-draft-v1';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type WorkspaceChatResponse = {
  reply?: string;
  provider?: string;
  model?: string;
  tier?: string;
  verifiedFree?: boolean;
  error?: string;
};

type LocalDraft = {
  title: string;
  body: string;
};

const sourceLinks = [
  {
    href: '/admin/ai',
    label: 'AI Control Plane',
    detail: 'Skill Hub · runtime · workflow',
    icon: Sparkles,
  },
  {
    href: '/admin/media',
    label: 'Media Engine',
    detail: 'Tài sản và media workflow',
    icon: Database,
  },
  {
    href: '/admin/publishing',
    label: 'Publishing',
    detail: 'Publish Inbox và bot đăng bài',
    icon: LayoutDashboard,
  },
] as const;

export default function DhpWorkspace() {
  const [title, setTitle] = useState('Ghi chú công việc mới');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<LocalDraft>;
      if (typeof parsed.title === 'string' && parsed.title.trim()) setTitle(parsed.title);
      if (typeof parsed.body === 'string') setBody(parsed.body);
    } catch {
      // A damaged browser-local draft should never block the workspace.
    }
  }, []);

  const saveDraft = () => {
    const draft: LocalDraft = { title, body };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const askAssistant = async (event: FormEvent) => {
    event.preventDefault();
    const message = question.trim();
    if (!message || busy) return;

    setBusy(true);
    setStatus(null);
    setQuestion('');
    setChat((current) => [...current, { role: 'user', content: message }]);

    try {
      const response = await fetch('/api/admin/workspace/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const payload = (await response.json().catch(() => ({}))) as WorkspaceChatResponse;
      if (!response.ok || typeof payload.reply !== 'string') {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }

      setChat((current) => [...current, { role: 'assistant', content: payload.reply as string }]);
      setRuntime(
        payload.provider && payload.model
          ? `${payload.provider} · ${payload.model} · ${payload.verifiedFree ? 'verified free' : payload.tier || 'unknown tier'}`
          : null,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Không thể kết nối DHP Workspace AI.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="border-b border-slate-200 bg-white px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Đại Hải Phát AI OS</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight">DHP Workspace</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <ShieldCheck className="h-4 w-4" /> Free-cloud-only runtime
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-4 p-4 lg:grid-cols-[230px_minmax(0,1fr)_360px] lg:p-6">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">D</div>
            <div>
              <p className="font-bold">Workspace</p>
              <p className="text-xs text-slate-500">DHP internal</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-start gap-2">
              <Database className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Source of truth</p>
                <p className="mt-1 text-sm text-slate-700">Sản phẩm, giá, CRM và knowledge chính thức vẫn thuộc DHP APIs.</p>
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-1" aria-label="Nguồn DHP">
            {sourceLinks.map(({ href, label, detail, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs leading-5 text-slate-500">{detail}</span>
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <FileText className="h-4 w-4" /> Bản nháp cục bộ
            </div>
            <button
              type="button"
              onClick={saveDraft}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              <Save className="h-4 w-4" /> {saved ? 'Đã lưu' : 'Lưu trên thiết bị'}
            </button>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-label="Tiêu đề ghi chú"
              className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-slate-300 md:text-4xl"
              placeholder="Tiêu đề"
            />
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Khu vực này là sổ làm việc cá nhân, không tự ghi đè PRODUCT_DB, PRICE_DB, CRM_DB hay dữ liệu nghiệp vụ chuẩn.
            </p>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              aria-label="Nội dung ghi chú"
              className="mt-7 min-h-[440px] w-full resize-y border-0 bg-transparent text-base leading-8 text-slate-800 outline-none placeholder:text-slate-300"
              placeholder="Bắt đầu ghi chú, kế hoạch, checklist công việc hoặc nội dung cần AI hỗ trợ…"
            />
          </div>
        </section>

        <aside className="flex min-h-[560px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h2 className="font-bold">DHP AI Assistant</h2>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">Model `dhp-free` · backend tự chọn cloud model zero-cost đang khả dụng.</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {chat.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                Hỏi về kế hoạch, nội dung hoặc công việc đang làm. AI không tự nhận là đã đọc CRM/giá/dự án nếu chưa được cung cấp dữ liệu đó.
              </div>
            )}
            {chat.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-xl px-3.5 py-3 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'ml-6 bg-slate-950 text-white'
                    : 'mr-6 border border-slate-200 bg-slate-50 text-slate-800'
                }`}
              >
                {message.content}
              </div>
            ))}
            {busy && <p className="text-xs font-semibold text-slate-500">Đang định tuyến model miễn phí…</p>}
            {status && <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{status}</p>}
          </div>

          <form onSubmit={askAssistant} className="border-t border-slate-200 p-4">
            {runtime && <p className="mb-2 break-all text-[11px] font-medium text-slate-500">Runtime: {runtime}</p>}
            <div className="flex gap-2">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={2}
                maxLength={12000}
                aria-label="Câu hỏi cho DHP AI"
                placeholder="Hỏi DHP AI…"
                className="min-w-0 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
              />
              <button
                type="submit"
                disabled={busy || !question.trim()}
                aria-label="Gửi câu hỏi"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}
