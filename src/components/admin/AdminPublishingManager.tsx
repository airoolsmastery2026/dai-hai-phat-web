"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, ShieldCheck, Unplug, XCircle } from "lucide-react";

type Platform = "facebook" | "instagram" | "tiktok" | "linkedin" | "pinterest" | "youtube";
type Account = {
  platform: Platform;
  verification_status: "unverified" | "verified" | "error";
  verified_account_id: string | null;
  verified_account_name: string | null;
  verification_error_code: string | null;
  last_verified_at: string | null;
};
type Field = { key: string; label: string; secret?: boolean; placeholder?: string };
type PlatformConfig = { id: Platform; label: string; note: string; fields: Field[] };
type CredentialState = Record<Platform, Record<string, string>>;

const PLATFORMS: PlatformConfig[] = [
  { id: "facebook", label: "Facebook Page", note: "Page token + Page ID", fields: [{ key: "accessToken", label: "Access Token", secret: true }, { key: "pageId", label: "Page ID" }] },
  { id: "instagram", label: "Instagram Business", note: "Meta token + Instagram User ID", fields: [{ key: "accessToken", label: "Access Token", secret: true }, { key: "userId", label: "Instagram User ID" }] },
  { id: "tiktok", label: "TikTok", note: "Direct Post token", fields: [{ key: "accessToken", label: "Access Token", secret: true }] },
  { id: "linkedin", label: "LinkedIn", note: "Token + author URN", fields: [{ key: "accessToken", label: "Access Token", secret: true }, { key: "authorUrn", label: "Author URN", placeholder: "urn:li:person:..." }] },
  { id: "pinterest", label: "Pinterest", note: "Token + Board ID", fields: [{ key: "accessToken", label: "Access Token", secret: true }, { key: "boardId", label: "Board ID" }] },
  { id: "youtube", label: "YouTube", note: "Token + Channel ID", fields: [{ key: "accessToken", label: "Access Token", secret: true }, { key: "channelId", label: "Channel ID" }] },
];

function emptyCredentials(): CredentialState {
  return Object.fromEntries(PLATFORMS.map(({ id }) => [id, {}])) as CredentialState;
}

async function parse(response: Response) {
  const payload = await response.json().catch(() => ({})) as { data?: unknown; error?: { message?: string } };
  if (!response.ok) throw new Error(payload.error?.message || `HTTP ${response.status}`);
  return payload;
}

export function AdminPublishingManager() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [credentials, setCredentials] = useState<CredentialState>(emptyCredentials);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const accountMap = useMemo(() => new Map(accounts.map((item) => [item.platform, item])), [accounts]);

  const refresh = useCallback(async () => {
    setBusy("refresh");
    try {
      const payload = await parse(await fetch("/api/admin/publishing/accounts", { cache: "no-store" }));
      setAccounts(Array.isArray(payload.data) ? payload.data as Account[] : []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể đọc trạng thái Publishing Cloud.");
    } finally {
      setBusy(null);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  async function mutate(config: PlatformConfig, method: "PUT" | "POST" | "DELETE") {
    setBusy(config.id);
    setMessage(null);
    try {
      const init: RequestInit = { method };
      if (method === "PUT") {
        init.headers = { "content-type": "application/json" };
        init.body = JSON.stringify(credentials[config.id]);
      }
      await parse(await fetch(`/api/admin/publishing/accounts/${config.id}`, init));
      if (method === "PUT" || method === "DELETE") setCredentials((current) => ({ ...current, [config.id]: {} }));
      setMessage(method === "DELETE" ? `${config.label}: đã ngắt kết nối.` : `${config.label}: đã gửi yêu cầu xác minh.`);
      window.setTimeout(() => void refresh(), 1500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Không thể cập nhật ${config.label}.`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Đại Hải Phát AI OS</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Publishing Accounts</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Credential được gửi server-side vào Supabase Vault và không được đọc ngược ra trình duyệt.</p>
        </div>
        <button type="button" onClick={() => void refresh()} disabled={busy !== null} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${busy === "refresh" ? "animate-spin" : ""}`} /> Làm mới
        </button>
      </header>

      {message ? <div role="status" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div> : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {PLATFORMS.map((config) => {
          const account = accountMap.get(config.id);
          const status = account?.verification_status ?? "disconnected";
          const verified = status === "verified";
          const complete = config.fields.every((field) => credentials[config.id][field.key]?.trim());
          return (
            <article key={config.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div><h2 className="font-bold text-slate-950">{config.label}</h2><p className="mt-1 text-xs text-slate-500">{config.note}</p></div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{status.toUpperCase()}</span>
              </div>

              {account ? <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><p className="font-semibold text-slate-800">{account.verified_account_name || account.verified_account_id || "Đã lưu credential"}</p>{account.verification_error_code ? <p className="mt-1 text-red-700">{account.verification_error_code}</p> : null}</div> : null}

              <div className="mt-4 space-y-3">
                {config.fields.map((field) => <label key={field.key} className="block text-sm font-semibold text-slate-700">{field.label}<input type={field.secret ? "password" : "text"} autoComplete="off" spellCheck={false} placeholder={field.placeholder} value={credentials[config.id][field.key] ?? ""} onChange={(event) => setCredentials((current) => ({ ...current, [config.id]: { ...current[config.id], [field.key]: event.target.value } }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>)}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" disabled={!complete || busy !== null} onClick={() => void mutate(config, "PUT")} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-40"><ShieldCheck className="h-4 w-4" /> Lưu vào Vault</button>
                {account ? <button type="button" disabled={busy !== null} onClick={() => void mutate(config, "POST")} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-semibold disabled:opacity-40">{verified ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4" />} Verify</button> : null}
                {account ? <button type="button" disabled={busy !== null} onClick={() => void mutate(config, "DELETE")} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3.5 py-2 text-sm font-semibold text-red-700 disabled:opacity-40"><Unplug className="h-4 w-4" /> Ngắt</button> : null}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
