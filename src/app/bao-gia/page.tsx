import type { Metadata } from "next";
import {
  CheckCircle2,
  FileText,
  ImageIcon,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Báo giá",
  description:
    "Chuẩn bị yêu cầu báo giá nội thất và cơ khí dân dụng tại Đại Hải Phát: hiện trạng, kích thước, vật liệu, địa điểm và quy trình xác nhận kỹ thuật.",
  alternates: { canonical: "/bao-gia" },
};

const preparationItems = [
  {
    icon: Ruler,
    title: "Kích thước / bản vẽ",
    description: "Kích thước sơ bộ, bản vẽ có sẵn hoặc các mốc đo chính của hạng mục.",
  },
  {
    icon: ImageIcon,
    title: "Ảnh hiện trạng",
    description: "Ảnh toàn cảnh và chi tiết vị trí cần thi công để nhận diện điều kiện thực tế.",
  },
  {
    icon: Wrench,
    title: "Vật liệu / hoàn thiện",
    description: "Loại vật liệu, màu sắc, phụ kiện hoặc mẫu tham khảo nếu bạn đã có lựa chọn.",
  },
  {
    icon: MapPin,
    title: "Địa điểm thi công",
    description: "Khu vực công trình giúp xác định việc khảo sát, vận chuyển và tổ chức thi công.",
  },
] as const;

const processSteps = [
  {
    number: "01",
    title: "Tiếp nhận nhu cầu",
    description: "Trợ lý tư vấn hoặc đội ngũ Đại Hải Phát ghi nhận hạng mục, mong muốn và dữ liệu bạn đang có.",
  },
  {
    number: "02",
    title: "Kiểm tra hồ sơ",
    description: "Kỹ sư rà soát kích thước, vật liệu, ảnh hiện trạng và các điểm cần làm rõ.",
  },
  {
    number: "03",
    title: "Khảo sát khi cần",
    description: "Các hạng mục phụ thuộc hiện trạng được đo kiểm trực tiếp trước khi chốt giải pháp.",
  },
  {
    number: "04",
    title: "Báo giá chính thức",
    description: "Phạm vi công việc, quy cách, khối lượng và điều kiện thực hiện được thể hiện rõ ràng.",
  },
] as const;

const quotePrinciples = [
  "Phạm vi công việc được mô tả rõ",
  "Vật liệu và quy cách có căn cứ",
  "Hạng mục phát sinh cần được xác nhận",
  "Tiến độ và điều kiện thi công minh bạch",
] as const;

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <PageHero
        eyebrow="Báo giá kỹ thuật"
        title="Đủ dữ liệu trước — báo giá đúng hơn"
        description="Gửi hiện trạng, kích thước, vật liệu và vị trí công trình. Đại Hải Phát sẽ làm rõ phần còn thiếu trước khi kỹ sư xác nhận phương án và phát hành báo giá chính thức."
        imageSrc="/images/materials/material01.webp"
        imageAlt="Vật liệu và mẫu hoàn thiện phục vụ lập báo giá Đại Hải Phát"
        imagePosition="68% center"
        highlights={["Không báo giá mơ hồ", "Có căn cứ vật liệu", "Kỹ sư xác nhận trước khi chốt"]}
        actions={
          <>
            <Button href="/ai-tu-van?ai=1">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Chuẩn bị thông tin
            </Button>
            <Button href="/contact?intent=quote" variant="secondary">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Gửi yêu cầu báo giá
            </Button>
          </>
        }
      />

      <section className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-metal-strong)]">
              Hồ sơ nên có
            </span>
            <h2 className="mt-[var(--space-2)] text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
              Bốn nhóm thông tin giúp rút ngắn vòng trao đổi
            </h2>
          </div>

          <div className="mt-[var(--space-6)] grid gap-[var(--space-4)] md:grid-cols-2 xl:grid-cols-4">
            {preparationItems.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-5)] shadow-[var(--shadow-sm)]"
              >
                <div className="mb-[var(--space-4)] flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-black text-[var(--color-text)]">{title}</h3>
                <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface-muted)] py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-metal-strong)]">
              Quy trình
            </span>
            <h2 className="mt-[var(--space-2)] text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
              Từ yêu cầu ban đầu đến báo giá chính thức
            </h2>
          </div>

          <ol className="mt-[var(--space-6)] grid gap-[var(--space-4)] lg:grid-cols-4">
            {processSteps.map((step) => (
              <li
                key={step.number}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-5)]"
              >
                <span className="text-sm font-black text-[var(--color-primary)]">{step.number}</span>
                <h3 className="mt-[var(--space-3)] text-lg font-black text-[var(--color-text)]">
                  {step.title}
                </h3>
                <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--color-text-muted)]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container>
          <div className="grid gap-[var(--space-6)] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-md)] lg:grid-cols-[1.1fr_0.9fr] lg:p-[var(--space-8)]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-[var(--space-4)] text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
                Báo giá rõ ràng trước khi thi công
              </h2>
              <p className="mt-[var(--space-3)] max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
                Ước tính ban đầu chỉ dùng để chuẩn bị trao đổi. Báo giá chính thức được phát hành sau khi thông tin kỹ thuật cần thiết đã được xác nhận.
              </p>
            </div>

            <ul className="grid content-center gap-[var(--space-3)]">
              {quotePrinciples.map((item) => (
                <li key={item} className="flex items-start gap-[var(--space-3)] text-sm font-semibold text-[var(--color-text)]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </main>
  );
}
