"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Bot, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";

type Role = "viewer" | "operator" | "admin" | "owner";
type Status = {
  botConfigured: boolean;
  webhookSecretConfigured: boolean;
  operators: Array<{ operatorId: string; role: Role; enabled: boolean }>;
};

async function api(url: string, init?: RequestInit): Promise<Status> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const payload = await response.json().catch(() => ({})) as {
    data?: Status;
    error?: { message?: string };
  };
  if (!response.ok) throw new Error(payload.error?.message || `HTTP ${response.status}`);
  return payload.data ?? { botConfigured: false, webhookSecretConfigured: false, operators: [] };
}

export function AdminTelegramControl() {
  const [status, setStatus] = useState<Status | null>(null);
  const [botToken, setBotToken] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [role, setRole] = useState<Role>("owner");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      setStatus(await api("/api/admin/telegram-control"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể đọc Telegram Control.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const next = await api("/api/admin/telegram-control", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ botToken, operatorId, role }),
      });
      setStatus(next);
      setBotToken("");
      setMessage("Đã lưu Bot Token vào Vault và cập nhật Operator ACL. Webhook cloud sẽ tự reconcile.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể lưu Telegram Control.");
    } finally {
      setBusy(false);
    }
  }

  const ready = Boolean(
    status?.botConfigured &&
    status.webhookSecretConfigured &&
    status.operators.some((operator) => operator.enabled),
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h2 className="font-bold text-slate-950">Telegram Control</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Bot Token chỉ đi server-side vào Supabase Vault. Webhook secret được hệ thống tự sinh và không hiển thị trong trình duyệt.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ready ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
            {ready ? "READY" : "CHỜ CẤU HÌNH"}
          </span>
          <button type="button" onClick={() => void refresh()} disabled={busy} className="rounded-lg border border-slate-300 p-2 disabled:opacity-40" aria-label="Làm mới Telegram Control">
            <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {status ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Bot Token:</strong> {status.botConfigured ? "Đã lưu Vault" : "Chưa có"}</div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Webhook secret:</strong> {status.webhookSecretConfigured ? "Đã tạo" : "Chưa tạo"}</div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Operators:</strong> {status.operators.filter((item) => item.enabled).length}</div>
        </div>
      ) : null}

      {status?.operators.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {status.operators.map((operator) => (
            <span key={operator.operatorId} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {operator.operatorId} · {operator.role}
            </span>
          ))}
        </div>
      ) : null}

      <form onSubmit={save} className="mt-5 grid gap-3 md:grid-cols-[1.4fr_1fr_0.7fr_auto] md:items-end">
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Telegram Bot Token
          <input type="password" autoComplete="off" spellCheck={false} value={botToken} onChange={(event) => setBotToken(event.target.value)} placeholder="123456789:AA..." className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Operator numeric ID
          <input inputMode="numeric" autoComplete="off" value={operatorId} onChange={(event) => setOperatorId(event.target.value.replace(/\D/g, ""))} placeholder="123456789" className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">
          Role
          <select value={role} onChange={(event) => setRole(event.target.value as Role)} className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal">
            <option value="owner">owner</option>
            <option value="admin">admin</option>
            <option value="operator">operator</option>
            <option value="viewer">viewer</option>
          </select>
        </label>
        <button type="submit" disabled={busy || botToken.trim().length < 20 || operatorId.length < 4} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 font-semibold text-white disabled:opacity-40">
          <ShieldCheck className="h-4 w-4" /> Lưu & kích hoạt
        </button>
      </form>

      {message ? <p role="status" className="mt-4 text-sm font-medium text-slate-700">{message}</p> : null}
    </section>
  );
}
