'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Inbox,
  Play,
  RefreshCw,
  Sparkles,
  Workflow,
} from 'lucide-react';

type Skill = {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  runtime: string;
};

type MediaJob = {
  id: string;
  workflowId: string;
  status: string;
  currentStage: string;
  attempts: number;
  createdAt: string;
};

type PublishPackage = {
  id: string;
  jobId: string;
  workflowId: string;
  status: string;
  content: string;
  platforms: string[];
  scheduledTime: string | null;
  importedAt: string | null;
  importedPostId: string | null;
};

type MediaReadiness = {
  status: 'ready' | 'degraded';
  providers: {
    text: { configured: boolean };
    render: { configured: boolean };
    voice: { configured: boolean };
    video: { configured: boolean };
    publish: { configured: boolean; mode: 'external-adapter' | 'cloud-inbox' };
  };
  videoOs: {
    queueAvailable: boolean;
    workerVerified: boolean;
  };
  authorization: string;
  persistence: string;
  missing: string[];
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: 'no-store' });
  const payload: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>).error
      : undefined;
    throw new Error(typeof message === 'string' ? message : `HTTP ${response.status}`);
  }
  return payload as T;
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('vi-VN');
}

function providerLabel(configured: boolean): string {
  return configured ? 'Đã cấu hình' : 'Chưa cấu hình';
}

export default function AdminAiControlPlane() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [jobs, setJobs] = useState<MediaJob[]>([]);
  const [packages, setPackages] = useState<PublishPackage[]>([]);
  const [readiness, setReadiness] = useState<MediaReadiness | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [workflowId, setWorkflowId] = useState('social-video');
  const [title, setTitle] = useState('Video giới thiệu sản phẩm Đại Hải Phát');
  const [platforms, setPlatforms] = useState('facebook,tiktok,youtube');

  const refresh = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    try {
      const [skillResponse, jobResponse, packageResponse, readinessResponse] = await Promise.all([
        api<{ data: Skill[] }>('/api/ai/control-plane/skills'),
        api<{ data: MediaJob[] }>('/api/ai/control-plane/media/jobs'),
        api<{ data: PublishPackage[] }>('/api/ai/control-plane/publish/packages'),
        api<{ data: MediaReadiness }>('/api/ai/control-plane/media/readiness'),
      ]);
      setSkills(skillResponse.data ?? []);
      setJobs(jobResponse.data ?? []);
      setPackages(packageResponse.data ?? []);
      setReadiness(readinessResponse.data ?? null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể kết nối Control Plane.');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const createJob = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      await api('/api/ai/control-plane/media/jobs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          workflowId,
          idempotencyKey: `web-${Date.now()}`,
          payload: {
            title,
            platforms: platforms.split(',').map((item) => item.trim()).filter(Boolean),
            source: 'dai-hai-phat-web-admin',
          },
        }),
      });
      setMessage('Đã tạo media job.');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tạo media job.');
    } finally {
      setBusy(false);
    }
  };

  const jobAction = async (jobId: string, action: 'run' | 'approve') => {
    setBusy(true);
    setMessage(null);
    try {
      await api(`/api/ai/control-plane/media/jobs/${encodeURIComponent(jobId)}/${action}`, {
        method: 'POST',
      });
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Không thể ${action} job.`);
    } finally {
      setBusy(false);
    }
  };

  const pendingPackages = packages.filter((item) => item.status === 'pending').length;
  const readinessItems = readiness
    ? [
        ['Text', readiness.providers.text.configured],
        ['Render', readiness.providers.render.configured],
        ['Voice', readiness.providers.voice.configured],
        ['Video', readiness.providers.video.configured],
        ['Publish', readiness.providers.publish.configured],
      ] as const
    : [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Đại Hải Phát AI OS</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Control Plane</h1>
          <p className="mt-2 text-slate-600">Quản lý Skill Hub, Media Engine và Publish Inbox từ một màn hình quản trị đã được bảo vệ.</p>
        </div>
        <button onClick={() => void refresh()} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} /> Làm mới
        </button>
      </div>

      {message && <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-950">Sẵn sàng Media Engine</h2>
            <p className="mt-1 text-sm text-slate-600">Chỉ hiển thị trạng thái cấu hình; URL, token và secret không được gửi xuống trình duyệt.</p>
          </div>
          <span className="w-fit rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {readiness ? (readiness.status === 'ready' ? 'READY' : 'DEGRADED') : 'ĐANG KIỂM TRA'}
          </span>
        </div>
        {readiness && (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {readinessItems.map(([label, configured]) => (
                <div key={label} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{providerLabel(configured)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-3">
              <p>Publish: {readiness.providers.publish.mode === 'cloud-inbox' ? 'Cloud Inbox' : 'External adapter'}</p>
              <p>Video OS queue: {readiness.videoOs.queueAvailable ? 'Có' : 'Không'}</p>
              <p>Video OS worker: {readiness.videoOs.workerVerified ? 'Đã xác minh' : 'Chưa xác minh'}</p>
            </div>
            {readiness.missing.length > 0 && (
              <p className="mt-3 text-sm font-semibold text-slate-700">Còn thiếu provider: {readiness.missing.join(', ')}.</p>
            )}
          </>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5" /><h2 className="font-bold text-slate-950">Skill Hub</h2></div>
          <div className="mt-4 space-y-3">
            {skills.length === 0 && <p className="text-sm text-slate-500">Chưa có skill được đăng ký hoặc Control Plane chưa cấu hình skill runtime.</p>}
            {skills.map((skill) => (
              <div key={skill.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-900">{skill.name}</p><p className="mt-1 text-xs text-slate-500">{skill.id} · {skill.runtime}</p></div><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
                <p className="mt-2 text-sm text-slate-600">{skill.description}</p>
                <p className="mt-2 text-xs text-slate-500">{(skill.capabilities ?? []).join(' · ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2"><Workflow className="h-5 w-5" /><h2 className="font-bold text-slate-950">Tạo Media Workflow</h2></div>
          <form onSubmit={createJob} className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Workflow ID<input value={workflowId} onChange={(event) => setWorkflowId(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Chủ đề<input value={title} onChange={(event) => setTitle(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Nền tảng<input value={platforms} onChange={(event) => setPlatforms(event.target.value)} placeholder="facebook,tiktok,youtube" className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
            <button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white disabled:opacity-50"><Sparkles className="h-4 w-4" /> Tạo job</button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-950">Media Jobs</h2>
        <div className="mt-4 grid gap-3">
          {jobs.length === 0 && <p className="text-sm text-slate-500">Chưa có media job.</p>}
          {jobs.map((job) => (
            <div key={job.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div><p className="font-semibold text-slate-900">{job.workflowId}</p><p className="mt-1 break-all text-xs text-slate-500">{job.id}</p><p className="mt-2 text-sm text-slate-600">{job.status} · stage: {job.currentStage} · attempts: {job.attempts}</p></div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => void jobAction(job.id, 'run')} disabled={busy || job.status === 'completed'} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-40"><Play className="h-4 w-4" /> Chạy bước</button>
                <button onClick={() => void jobAction(job.id, 'approve')} disabled={busy || job.status !== 'waiting_review'} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"><CheckCircle2 className="h-4 w-4" /> Duyệt</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2"><Inbox className="h-5 w-5" /><h2 className="font-bold text-slate-950">Publish Inbox</h2></div>
          <p className="text-xs font-semibold text-slate-500">{pendingPackages} package đang chờ BOT ĐĂNG BÀI</p>
        </div>
        <div className="mt-4 grid gap-3">
          {packages.length === 0 && <p className="text-sm text-slate-500">Chưa có publish package.</p>}
          {packages.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{item.workflowId}</p>
                  <p className="mt-1 break-all text-xs text-slate-500">job: {item.jobId}</p>
                </div>
                <span className="w-fit rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">{item.status}</span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-slate-700">{item.content}</p>
              <div className="mt-3 grid gap-1 text-xs text-slate-500 sm:grid-cols-3">
                <p>Nền tảng: {(item.platforms ?? []).join(', ') || '—'}</p>
                <p>Lịch: {formatDate(item.scheduledTime)}</p>
                <p>{item.importedAt ? `Đã nhập: ${formatDate(item.importedAt)}` : 'Chưa được BOT nhập'}</p>
              </div>
              {item.importedPostId && <p className="mt-2 break-all text-xs text-slate-500">Post ID: {item.importedPostId}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
