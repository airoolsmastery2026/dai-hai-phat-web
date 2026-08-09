'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  LogOut,
  Play,
  RefreshCw,
  ShieldCheck,
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

export default function AdminAiControlPlane() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [token, setToken] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [jobs, setJobs] = useState<MediaJob[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [workflowId, setWorkflowId] = useState('social-video');
  const [title, setTitle] = useState('Video giới thiệu sản phẩm Đại Hải Phát');
  const [platforms, setPlatforms] = useState('facebook,tiktok,youtube');

  const refresh = useCallback(async () => {
    setBusy(true);
    setMessage(null);
    try {
      const [skillResponse, jobResponse] = await Promise.all([
        api<{ data: Skill[] }>('/api/ai/control-plane/skills'),
        api<{ data: MediaJob[] }>('/api/ai/control-plane/media/jobs'),
      ]);
      setSkills(skillResponse.data ?? []);
      setJobs(jobResponse.data ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể kết nối Control Plane.');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    api<{ authenticated: boolean }>('/api/admin/session')
      .then((result) => {
        setAuthenticated(result.authenticated);
        if (result.authenticated) void refresh();
      })
      .catch(() => setAuthenticated(false));
  }, [refresh]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      await api('/api/admin/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      setToken('');
      setAuthenticated(true);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Đăng nhập thất bại.');
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    setAuthenticated(false);
    setSkills([]);
    setJobs([]);
  };

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

  if (authenticated === null) {
    return <div className="p-8 text-slate-500">Đang kiểm tra phiên quản trị…</div>;
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <form onSubmit={login} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ShieldCheck className="h-9 w-9 text-slate-900" />
          <h1 className="mt-4 text-2xl font-bold text-slate-950">DHP AI Admin</h1>
          <p className="mt-2 text-sm text-slate-600">Nhập khóa quản trị. Khóa chỉ được gửi một lần để tạo phiên HttpOnly và không lưu trong trình duyệt.</p>
          <label className="mt-6 block text-sm font-semibold text-slate-800" htmlFor="admin-token">Khóa quản trị</label>
          <input id="admin-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-slate-900" />
          {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
          <button disabled={busy} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white disabled:opacity-50">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Đăng nhập
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Đại Hải Phát AI OS</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Control Plane</h1>
          <p className="mt-2 text-slate-600">Quản lý Skill Hub và luồng Media Engine từ một màn hình.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void refresh()} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"><RefreshCw className="h-4 w-4" /> Làm mới</button>
          <button onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"><LogOut className="h-4 w-4" /> Thoát</button>
        </div>
      </div>

      {message && <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div>}

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
            <input value={workflowId} onChange={(event) => setWorkflowId(event.target.value)} placeholder="Workflow ID" className="rounded-xl border border-slate-300 px-3 py-2.5" />
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Chủ đề" className="rounded-xl border border-slate-300 px-3 py-2.5" />
            <input value={platforms} onChange={(event) => setPlatforms(event.target.value)} placeholder="facebook,tiktok,youtube" className="rounded-xl border border-slate-300 px-3 py-2.5" />
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
    </div>
  );
}
