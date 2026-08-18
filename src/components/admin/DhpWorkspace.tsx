'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Bot,
  CheckSquare,
  Database,
  FileText,
  Heading2,
  LayoutDashboard,
  ListPlus,
  Plus,
  Save,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';

const WORKSPACE_KEY = 'dhp-workspace-v2';
const MAX_LOCAL_IMPORT_BYTES = 2 * 1024 * 1024;

type BlockKind = 'paragraph' | 'heading' | 'checklist';

type WorkspaceBlock = {
  id: string;
  kind: BlockKind;
  text: string;
  checked?: boolean;
};

type WorkspacePage = {
  id: string;
  title: string;
  blocks: WorkspaceBlock[];
};

type WorkspaceState = {
  pages: WorkspacePage[];
  activePageId: string;
};

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
  usedKnowledgeContext?: boolean;
  error?: string;
};

type KnowledgePrice = {
  id: string;
  material: string;
  unit: string;
  min: number;
  max: number;
  conditions: string[];
};

type KnowledgeImage = {
  id: string;
  title: string;
  caption: string;
};

type KnowledgeResponse = {
  source?: string;
  verified?: boolean;
  evidence?: {
    materials: string[];
    prices: KnowledgePrice[];
    images: KnowledgeImage[];
    canShowCostRange: boolean;
    pricingRule: string;
  };
  error?: string;
};

function createId(): string {
  return globalThis.crypto.randomUUID();
}

function newPage(title = 'Trang mới'): WorkspacePage {
  return {
    id: createId(),
    title,
    blocks: [
      {
        id: createId(),
        kind: 'paragraph',
        text: '',
      },
    ],
  };
}

function initialWorkspace(): WorkspaceState {
  const page = newPage('Ghi chú công việc mới');
  return { pages: [page], activePageId: page.id };
}

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

function formatMoney(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}

export default function DhpWorkspace() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(() => initialWorkspace());
  const [saved, setSaved] = useState(false);
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<string | null>(null);
  const [service, setService] = useState('noi that');
  const [keywords, setKeywords] = useState('');
  const [knowledge, setKnowledge] = useState<KnowledgeResponse['evidence'] | null>(null);
  const [knowledgeBusy, setKnowledgeBusy] = useState(false);

  const activePage = useMemo(
    () => workspace.pages.find((page) => page.id === workspace.activePageId) ?? workspace.pages[0],
    [workspace],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(WORKSPACE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as WorkspaceState;
        if (
          Array.isArray(parsed.pages) &&
          parsed.pages.length > 0 &&
          typeof parsed.activePageId === 'string'
        ) {
          setWorkspace(parsed);
        }
      } catch {
        // Damaged browser-local workspace data must never block the admin workspace.
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const saveWorkspace = () => {
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const createPage = () => {
    const page = newPage();
    setWorkspace((current) => ({
      pages: [...current.pages, page],
      activePageId: page.id,
    }));
  };

  const deletePage = (pageId: string) => {
    setWorkspace((current) => {
      if (current.pages.length <= 1) return current;
      const pages = current.pages.filter((page) => page.id !== pageId);
      return {
        pages,
        activePageId: current.activePageId === pageId ? pages[0].id : current.activePageId,
      };
    });
  };

  const updateActivePage = (updater: (page: WorkspacePage) => WorkspacePage) => {
    setWorkspace((current) => ({
      ...current,
      pages: current.pages.map((page) =>
        page.id === current.activePageId ? updater(page) : page,
      ),
    }));
  };

  const addBlock = (kind: BlockKind) => {
    updateActivePage((page) => ({
      ...page,
      blocks: [
        ...page.blocks,
        {
          id: createId(),
          kind,
          text: '',
          ...(kind === 'checklist' ? { checked: false } : {}),
        },
      ],
    }));
  };

  const updateBlock = (blockId: string, patch: Partial<WorkspaceBlock>) => {
    updateActivePage((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.id === blockId ? { ...block, ...patch } : block,
      ),
    }));
  };

  const deleteBlock = (blockId: string) => {
    updateActivePage((page) => {
      const blocks = page.blocks.filter((block) => block.id !== blockId);
      return {
        ...page,
        blocks: blocks.length > 0 ? blocks : [{ id: createId(), kind: 'paragraph', text: '' }],
      };
    });
  };

  const importLocalDocument = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_LOCAL_IMPORT_BYTES) {
      setStatus('Tệp cục bộ vượt giới hạn 2 MB cho Workspace v2.');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['txt', 'md', 'csv', 'json'].includes(extension)) {
      setStatus('Workspace v2 chỉ đọc cục bộ TXT/MD/CSV/JSON. PDF, Excel và ảnh sẽ đi qua ingestion backend ở bước tiếp theo.');
      return;
    }

    try {
      const text = await file.text();
      const page = newPage(file.name.replace(/\.[^.]+$/, ''));
      page.blocks = [
        {
          id: createId(),
          kind: 'paragraph',
          text: text.slice(0, 100_000),
        },
      ];
      setWorkspace((current) => ({
        pages: [...current.pages, page],
        activePageId: page.id,
      }));
      setStatus(`Đã nhập ${file.name} vào bản nháp cục bộ. Chưa ghi vào dữ liệu nghiệp vụ DHP.`);
    } catch {
      setStatus('Không thể đọc tệp cục bộ này.');
    }
  };

  const searchKnowledge = async (event: FormEvent) => {
    event.preventDefault();
    if (!service.trim()) return;
    setKnowledgeBusy(true);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/workspace/knowledge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          service: service.trim(),
          keywords: keywords.split(',').map((item) => item.trim()).filter(Boolean),
          limit: 6,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as KnowledgeResponse;
      if (!response.ok || !payload.evidence) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }
      setKnowledge(payload.evidence);
    } catch (error) {
      setKnowledge(null);
      setStatus(error instanceof Error ? error.message : 'Không thể tra DHP Knowledge.');
    } finally {
      setKnowledgeBusy(false);
    }
  };

  const knowledgeContext = useMemo(() => {
    if (!knowledge) return '';
    return JSON.stringify({
      materials: knowledge.materials,
      prices: knowledge.prices,
      imageReferences: knowledge.images.map((image) => ({
        id: image.id,
        title: image.title,
        caption: image.caption,
      })),
      canShowCostRange: knowledge.canShowCostRange,
      pricingRule: knowledge.pricingRule,
    });
  }, [knowledge]);

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
        body: JSON.stringify({
          message,
          knowledgeContext,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as WorkspaceChatResponse;
      if (!response.ok || typeof payload.reply !== 'string') {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }

      setChat((current) => [...current, { role: 'assistant', content: payload.reply as string }]);
      setRuntime(
        payload.provider && payload.model
          ? `${payload.provider} · ${payload.model} · ${payload.verifiedFree ? 'verified free' : payload.tier || 'unknown tier'}${payload.usedKnowledgeContext ? ' · DHP knowledge' : ''}`
          : null,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Không thể kết nối DHP Workspace AI.');
    } finally {
      setBusy(false);
    }
  };

  if (!activePage) return null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="border-b border-slate-200 bg-white px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Đại Hải Phát AI OS</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight">DHP Workspace v2</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <ShieldCheck className="h-4 w-4" /> DHP source-of-truth · free-cloud-only AI
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-4 p-4 xl:grid-cols-[250px_minmax(0,1fr)_390px] xl:p-6">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">D</div>
              <div>
                <p className="font-bold">Pages</p>
                <p className="text-xs text-slate-500">Browser-local drafts</p>
              </div>
            </div>
            <button type="button" onClick={createPage} aria-label="Tạo trang" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-1">
            {workspace.pages.map((page) => (
              <div key={page.id} className={`group flex items-center gap-1 rounded-lg ${page.id === workspace.activePageId ? 'bg-slate-100' : ''}`}>
                <button
                  type="button"
                  onClick={() => setWorkspace((current) => ({ ...current, activePageId: page.id }))}
                  className="min-w-0 flex-1 truncate px-3 py-2 text-left text-sm font-medium"
                >
                  {page.title || 'Không tiêu đề'}
                </button>
                {workspace.pages.length > 1 && (
                  <button type="button" onClick={() => deletePage(page.id)} aria-label={`Xóa ${page.title}`} className="mr-1 grid h-7 w-7 place-items-center rounded-md opacity-60 hover:bg-white hover:opacity-100">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <Upload className="h-4 w-4" /> Import TXT/MD/CSV/JSON
            <input type="file" accept=".txt,.md,.csv,.json,text/plain,text/markdown,text/csv,application/json" className="sr-only" onChange={(event) => void importLocalDocument(event)} />
          </label>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Source of truth</p>
            <p className="mt-1 text-sm text-slate-700">Pages là workspace draft. Product, price, CRM, project và knowledge chính thức vẫn thuộc DHP APIs.</p>
          </div>

          <nav className="mt-5 space-y-1" aria-label="Nguồn DHP">
            {sourceLinks.map(({ href, label, detail, icon: Icon }) => (
              <Link key={href} href={href} className="flex gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-100">
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
              <FileText className="h-4 w-4" /> Page + block editor
            </div>
            <button type="button" onClick={saveWorkspace} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white">
              <Save className="h-4 w-4" /> {saved ? 'Đã lưu' : 'Lưu workspace'}
            </button>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <input
              value={activePage.title}
              onChange={(event) => updateActivePage((page) => ({ ...page, title: event.target.value }))}
              aria-label="Tiêu đề trang"
              className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-slate-300 md:text-4xl"
              placeholder="Không tiêu đề"
            />

            <div className="mt-7 space-y-2">
              {activePage.blocks.map((block) => (
                <div key={block.id} className="group flex items-start gap-2 rounded-xl px-2 py-1 hover:bg-slate-50">
                  {block.kind === 'checklist' && (
                    <input
                      type="checkbox"
                      checked={Boolean(block.checked)}
                      onChange={(event) => updateBlock(block.id, { checked: event.target.checked })}
                      className="mt-3 h-4 w-4 rounded border-slate-300"
                    />
                  )}
                  <textarea
                    value={block.text}
                    onChange={(event) => updateBlock(block.id, { text: event.target.value })}
                    rows={block.kind === 'heading' ? 1 : 2}
                    aria-label={`Block ${block.kind}`}
                    className={`min-w-0 flex-1 resize-y border-0 bg-transparent px-2 py-2 outline-none placeholder:text-slate-300 ${
                      block.kind === 'heading' ? 'text-xl font-bold leading-8' : 'text-base leading-7'
                    } ${block.checked ? 'text-slate-400 line-through' : 'text-slate-800'}`}
                    placeholder={block.kind === 'heading' ? 'Tiêu đề…' : block.kind === 'checklist' ? 'Việc cần làm…' : 'Viết nội dung…'}
                  />
                  <button type="button" onClick={() => deleteBlock(block.id)} aria-label="Xóa block" className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 opacity-50 hover:bg-white hover:text-slate-700 group-hover:opacity-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => addBlock('paragraph')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"><ListPlus className="h-4 w-4" /> Đoạn văn</button>
              <button type="button" onClick={() => addBlock('heading')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"><Heading2 className="h-4 w-4" /> Heading</button>
              <button type="button" onClick={() => addBlock('checklist')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"><CheckSquare className="h-4 w-4" /> Checklist</button>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2"><Search className="h-5 w-5" /><h2 className="font-bold">DHP Knowledge</h2></div>
            <p className="mt-1 text-xs leading-5 text-slate-500">Tra pricing/material/reference từ DHP APIs; không đọc từ draft như nguồn chính thức.</p>
            <form onSubmit={searchKnowledge} className="mt-3 space-y-2">
              <input value={service} onChange={(event) => setService(event.target.value)} placeholder="Hạng mục: noi that, cua cong…" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <input value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="Từ khóa, cách nhau bằng dấu phẩy" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <button disabled={knowledgeBusy} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-50">{knowledgeBusy ? 'Đang tra…' : 'Tra DHP Knowledge'}</button>
            </form>
            {knowledge && (
              <div className="mt-4 space-y-3 text-sm">
                <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Materials</p><p className="mt-1 text-slate-700">{knowledge.materials.join(' · ') || 'Chưa có dữ liệu phù hợp'}</p></div>
                {knowledge.prices.slice(0, 4).map((price) => (
                  <div key={price.id} className="rounded-xl border border-slate-200 p-3">
                    <p className="font-semibold">{price.material}</p>
                    <p className="mt-1 text-slate-600">{formatMoney(price.min)}–{formatMoney(price.max)} VND/{price.unit}</p>
                  </div>
                ))}
                {knowledge.images.length > 0 && <p className="text-xs text-slate-500">Có {knowledge.images.length} reference image đã xác minh trong catalog.</p>}
              </div>
            )}
          </section>

          <section className="flex min-h-[500px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
              <div className="flex items-center gap-2"><Bot className="h-5 w-5" /><h2 className="font-bold">DHP AI Assistant</h2></div>
              <p className="mt-1 text-xs leading-5 text-slate-500">Model `dhp-free`. Chỉ DHP Knowledge đã tra ở trên được đưa làm context tự động.</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
              {chat.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">Hỏi về kế hoạch hoặc knowledge đã tra. Draft trang hiện tại không tự động gửi sang model.</div>
              )}
              {chat.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`rounded-xl px-3.5 py-3 text-sm leading-6 ${message.role === 'user' ? 'ml-6 bg-slate-950 text-white' : 'mr-6 border border-slate-200 bg-slate-50 text-slate-800'}`}>
                  {message.content}
                </div>
              ))}
              {busy && <p className="text-xs font-semibold text-slate-500">Đang định tuyến model miễn phí…</p>}
              {status && <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{status}</p>}
            </div>

            <form onSubmit={askAssistant} className="border-t border-slate-200 p-4">
              {runtime && <p className="mb-2 break-all text-[11px] font-medium text-slate-500">Runtime: {runtime}</p>}
              <div className="flex gap-2">
                <textarea value={question} onChange={(event) => setQuestion(event.target.value)} rows={2} maxLength={12000} aria-label="Câu hỏi cho DHP AI" placeholder="Hỏi DHP AI…" className="min-w-0 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500" />
                <button type="submit" disabled={busy || !question.trim()} aria-label="Gửi câu hỏi" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-white disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button>
              </div>
            </form>
          </section>
        </aside>
      </div>
    </main>
  );
}
