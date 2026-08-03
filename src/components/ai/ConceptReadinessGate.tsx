"use client";

import { CheckCircle2, ClipboardCheck, ExternalLink } from "lucide-react";
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
  const result = useMemo(() => evaluateConceptReadiness(profile), [profile]);

  const update = <K extends keyof ConceptReadinessProfile>(
    key: K,
    value: ConceptReadinessProfile[K],
  ) => setProfile((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setUnlocked(result.decision === "ready");
  };

  if (unlocked) {
    return (
      <div className="space-y-[var(--space-6)]">
        <Alert title="Hồ sơ đủ điều kiện tạo bản tham khảo" tone="success">
          Điểm sẵn sàng {result.score}/100. Thông tin này mới là bước sàng lọc ban
          đầu; kỹ sư Đại Hải Phát vẫn xác nhận kỹ thuật, khảo sát và báo giá.
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
            Đại Hải Phát dùng thông tin này để đánh giá mức độ sẵn sàng, tránh tạo
            hình không đúng nhu cầu và ưu tiên khách hàng có dự án thực tế.
          </p>
        </div>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">Họ và tên
            <input className={INPUT_CLASS} value={profile.name} onChange={(e) => update("name", e.target.value)} required />
          </label>
          <label className="text-sm font-semibold">Số điện thoại
            <input className={INPUT_CLASS} inputMode="tel" value={profile.phone} onChange={(e) => update("phone", e.target.value)} required />
          </label>
          <label className="text-sm font-semibold">Zalo
            <input className={INPUT_CLASS} inputMode="tel" value={profile.zalo} onChange={(e) => update("zalo", e.target.value)} />
          </label>
          <label className="text-sm font-semibold">Khu vực hoặc địa chỉ công trình
            <input className={INPUT_CLASS} value={profile.projectArea} onChange={(e) => update("projectArea", e.target.value)} required />
          </label>
          <label className="text-sm font-semibold">Hạng mục cần thực hiện
            <select className={INPUT_CLASS} value={profile.service} onChange={(e) => update("service", e.target.value)} required>
              <option value="">Chọn hạng mục</option>
              <option>Cửa cổng</option><option>Cầu thang và lan can</option><option>Mái che</option><option>Nội thất</option><option>Cải tạo không gian</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Kích thước ước tính
            <input className={INPUT_CLASS} value={profile.dimensions} onChange={(e) => update("dimensions", e.target.value)} placeholder="Ví dụ: rộng 3,6 m, cao 2,4 m" required />
          </label>
          <label className="text-sm font-semibold">Khoảng ngân sách
            <select className={INPUT_CLASS} value={profile.budget} onChange={(e) => update("budget", e.target.value)}>
              <option value="">Chưa xác định</option><option>Dưới 20 triệu</option><option>20–50 triệu</option><option>50–100 triệu</option><option>Trên 100 triệu</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Thời gian dự kiến
            <select className={INPUT_CLASS} value={profile.timeline} onChange={(e) => update("timeline", e.target.value)}>
              <option value="">Chưa xác định</option><option>Trong 1 tháng</option><option>1–3 tháng</option><option>3–6 tháng</option><option>Trên 6 tháng</option>
            </select>
          </label>
          <label className="text-sm font-semibold md:col-span-2">Mục đích
            <select className={INPUT_CLASS} value={profile.purpose} onChange={(e) => update("purpose", e.target.value as ConceptReadinessProfile["purpose"])} required>
              <option value="">Chọn mục đích</option><option value="build">Đang xây mới</option><option value="renovate">Đang cải tạo</option><option value="reference">Chỉ tham khảo ý tưởng</option>
            </select>
          </label>
          <label className="text-sm font-semibold md:col-span-2">Mô tả nhu cầu
            <textarea className={INPUT_CLASS} rows={5} value={profile.description} onChange={(e) => update("description", e.target.value)} placeholder="Mô tả hiện trạng, vật liệu, màu sắc, phần cần giữ nguyên và yêu cầu mong muốn..." required />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 text-sm">
            <input type="checkbox" checked={profile.hasSiteImage} onChange={(e) => update("hasSiteImage", e.target.checked)} />
            Tôi đã chuẩn bị ảnh hiện trạng thật của công trình.
          </label>
          <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 text-sm">
            <input type="checkbox" checked={profile.hasReferenceImage} onChange={(e) => update("hasReferenceImage", e.target.checked)} />
            Tôi đã chuẩn bị ảnh mẫu hoặc phong cách tham khảo.
          </label>
        </div>

        <label className="flex items-start gap-3 text-sm leading-6">
          <input className="mt-1" type="checkbox" checked={profile.consent} onChange={(e) => update("consent", e.target.checked)} required />
          Tôi đồng ý gửi hồ sơ này cho Đại Hải Phát để kỹ sư xem xét và liên hệ tư vấn.
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold">Điểm sẵn sàng hiện tại: {result.score}/100</p>
            <p className="text-xs text-[var(--color-text-muted)]">Từ 80 điểm và đủ thông tin bắt buộc mới mở công cụ tạo bản tham khảo.</p>
          </div>
          <button type="submit" className="inline-flex min-h-[var(--control-min-size)] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Kiểm tra hồ sơ
          </button>
        </div>
      </form>

      {submitted && result.decision === "needs_information" ? (
        <Alert title="Hồ sơ chưa đủ điều kiện" tone="warning">
          Vui lòng bổ sung: {result.missing.join(", ") || "thông tin dự án chi tiết hơn"}.
        </Alert>
      ) : null}

      {submitted && result.decision === "requires_review" ? (
        <Alert title="Hồ sơ cần kỹ sư xem trước" tone="info">
          <div className="space-y-3">
            <p>Điểm sẵn sàng {result.score}/100. Đại Hải Phát sẽ kiểm tra nhu cầu trước khi sử dụng lượt tạo phối cảnh.</p>
            <a href={COMPANY_CONFIG.socials.zalo1} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-bold text-[var(--color-primary)]">
              Gửi hồ sơ qua Zalo để xin duyệt
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Alert>
      ) : null}
    </Card>
  );
}
