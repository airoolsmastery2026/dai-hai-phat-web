"use client";

import { CheckCircle2, ClipboardCheck, ExternalLink, Loader2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { COMPANY_CONFIG } from "@/content/company";
import {
  evaluateConceptReadiness,
  type ConceptReadinessProfile,
} from "@/lib/ai/concept-readiness";

interface ConceptReadinessGateProps {
  children: React.ReactNode;
}

const INITIAL_PROFILE: ConceptReadinessProfile = {
  name: "",
  phone: "",
  zalo: "",
  projectArea: "",
  service: "",
  dimensions: "",
  budget: "",
  timeline: "",
  purpose: "",
  description: "",
  hasSiteImage: false,
  hasReferenceImage: false,
  consent: false,
};

const INPUT_CLASS =
  "mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-focus)]";

export function ConceptReadinessGate({ children }: ConceptReadinessGateProps) {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [submitted, setSubmitted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requestId] = useState(() => crypto.randomUUID());
  const result = useMemo(() => evaluateConceptReadiness(profile), [profile]);

  const update = <K extends keyof ConceptReadinessProfile>(
    key: K,
    value: ConceptReadinessProfile[K],
  ) => setProfile((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setSubmitError("");

    if (result.decision === "needs_information") return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/project-inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...profile, requestId }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Chưa thể gửi hồ sơ.");
      }
      setUnlocked(result.decision === "ready");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Chưa thể gửi hồ sơ. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (unlocked) {
    return (
      <div className="space-y-[var(--space-6)]">
        <Alert title="Hồ sơ đã được lưu và đủ điều kiện" tone="success">
          Điểm sẵn sàng {result.score}/100. Kỹ sư Đại Hải Phát đã nhận hồ sơ để
          tiếp tục xác nhận kỹ thuật, khảo sát và báo giá khi cần.
        </Alert>
        {children}
      </div>
    );
  }

  return (
    <Card className="p-[var(--space-5)] sm:p-[var(--space-6)]">
      <div className="flex items-start gap-3">
        <ClipboardCheck className="mt-1 h-6 w-6 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-metal-strong)]">
            Bước bắt buộc · Kiểm tra nhu cầu thực
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--color-text)]">
            Hoàn thiện hồ sơ trước khi tạo phối cảnh
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Thông tin được lưu thành một hồ sơ dự án và chuyển cho kỹ sư Đại Hải
            Phát. Không cần nhập lại khi tiếp tục tư vấn.
          </p>
        </div>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit} autoComplete="on">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">Họ và tên
            <input
              className={INPUT_CLASS}
              name="name"
              autoComplete="name"
              maxLength={120}
              value={profile.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </label>
          <label className="text-sm font-semibold">Số điện thoại
            <input
              className={INPUT_CLASS}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={30}
              value={profile.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </label>
          <label className="text-sm font-semibold">Zalo
            <input
              className={INPUT_CLASS}
              name="zalo"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={30}
              value={profile.zalo}
              onChange={(e) => update("zalo", e.target.value)}
            />
          </label>
          <label className="text-sm font-semibold">Khu vực hoặc địa chỉ công trình
            <input
              className={INPUT_CLASS}
              name="projectArea"
              autoComplete="street-address"
              maxLength={200}
              value={profile.projectArea}
              onChange={(e) => update("projectArea", e.target.value)}
              required
            />
          </label>
          <label className="text-sm font-semibold">Hạng mục cần thực hiện
            <select
              className={INPUT_CLASS}
              name="service"
              value={profile.service}
              onChange={(e) => update("service", e.target.value)}
              required
            >
              <option value="">Chọn hạng mục</option>
              <option>Cửa cổng</option><option>Cầu thang và lan can</option><option>Mái che</option><option>Nội thất</option><option>Cải tạo không gian</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Kích thước ước tính
            <input
              className={INPUT_CLASS}
              name="dimensions"
              maxLength={160}
              value={profile.dimensions}
              onChange={(e) => update("dimensions", e.target.value)}
              placeholder="Ví dụ: rộng 3,6 m, cao 2,4 m"
              required
            />
          </label>
          <label className="text-sm font-semibold">Khoảng ngân sách
            <select
              className={INPUT_CLASS}
              name="budget"
              value={profile.budget}
              onChange={(e) => update("budget", e.target.value)}
            >
              <option value="">Chưa xác định</option><option>Dưới 20 triệu</option><option>20–50 triệu</option><option>50–100 triệu</option><option>Trên 100 triệu</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Thời gian dự kiến
            <select
              className={INPUT_CLASS}
              name="timeline"
              value={profile.timeline}
              onChange={(e) => update("timeline", e.target.value)}
            >
              <option value="">Chưa xác định</option><option>Trong 1 tháng</option><option>1–3 tháng</option><option>3–6 tháng</option><option>Trên 6 tháng</option>
            </select>
          </label>
          <label className="text-sm font-semibold md:col-span-2">Mục đích
            <select
              className={INPUT_CLASS}
              name="purpose"
              value={profile.purpose}
              onChange={(e) => update("purpose", e.target.value as ConceptReadinessProfile["purpose"])}
              required
            >
              <option value="">Chọn mục đích</option><option value="build">Đang xây mới</option><option value="renovate">Đang cải tạo</option><option value="reference">Chỉ tham khảo ý tưởng</option>
            </select>
          </label>
          <label className="text-sm font-semibold md:col-span-2">Mô tả nhu cầu
            <textarea
              className={INPUT_CLASS}
              name="description"
              rows={5}
              minLength={10}
              maxLength={2000}
              value={profile.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Mô tả hiện trạng, vật liệu, màu sắc, phần cần giữ nguyên và yêu cầu mong muốn..."
              required
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 text-sm">
            <input
              name="hasSiteImage"
              type="checkbox"
              checked={profile.hasSiteImage}
              onChange={(e) => update("hasSiteImage", e.target.checked)}
            />
            Tôi đã chuẩn bị ảnh hiện trạng thật của công trình.
          </label>
          <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 text-sm">
            <input
              name="hasReferenceImage"
              type="checkbox"
              checked={profile.hasReferenceImage}
              onChange={(e) => update("hasReferenceImage", e.target.checked)}
            />
            Tôi đã chuẩn bị ảnh mẫu hoặc phong cách tham khảo.
          </label>
        </div>

        <label className="flex items-start gap-3 text-sm leading-6">
          <input
            className="mt-1"
            name="consent"
            type="checkbox"
            checked={profile.consent}
            onChange={(e) => update("consent", e.target.checked)}
            required
          />
          Tôi đồng ý gửi hồ sơ này cho Đại Hải Phát để kỹ sư xem xét và liên hệ tư vấn.
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold">Điểm sẵn sàng hiện tại: {result.score}/100</p>
            <p className="text-xs text-[var(--color-text-muted)]">Từ 80 điểm và đủ thông tin bắt buộc mới mở công cụ tạo bản tham khảo.</p>
          </div>
          <button disabled={submitting} type="submit" className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)] disabled:cursor-wait disabled:opacity-60">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            {submitting ? "Đang gửi hồ sơ" : "Lưu và kiểm tra hồ sơ"}
          </button>
        </div>
      </form>

      {submitError ? <Alert title="Chưa gửi được hồ sơ" tone="warning">{submitError}</Alert> : null}

      {submitted && result.decision === "needs_information" ? (
        <Alert title="Hồ sơ chưa đủ điều kiện" tone="warning">
          Vui lòng bổ sung: {result.missing.join(", ") || "thông tin dự án chi tiết hơn"}.
        </Alert>
      ) : null}

      {submitted && !submitError && !submitting && result.decision === "requires_review" ? (
        <Alert title="Hồ sơ đã được chuyển cho kỹ sư" tone="info">
          <div className="space-y-3">
            <p>Điểm sẵn sàng {result.score}/100. Đại Hải Phát sẽ kiểm tra nhu cầu trước khi mở lượt tạo phối cảnh.</p>
            <a href={COMPANY_CONFIG.socials.zalo1} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold text-[var(--color-primary)]">
              Trao đổi thêm qua Zalo
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Alert>
      ) : null}
    </Card>
  );
}
