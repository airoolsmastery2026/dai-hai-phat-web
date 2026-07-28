import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { COMPANY_CONFIG } from "@/content/company";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ Đại Hải Phát để nhận tư vấn báo giá và đặt lịch thi công.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Liên hệ Đại Hải Phát",
    description: "Liên hệ Đại Hải Phát để nhận tư vấn báo giá và đặt lịch thi công.",
    url: `${COMPANY_CONFIG.websiteUrl}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <PageHero
        eyebrow="Liên hệ kỹ thuật"
        title="Gửi dữ liệu hiện trạng trước khi khảo sát"
        description="Chọn một kênh liên hệ đang hoạt động để gửi hạng mục, vị trí, kích thước dự kiến và ảnh hiện trạng cho đội ngũ Đại Hải Phát."
      />

      <section className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="space-y-[var(--space-6)] p-[var(--space-8)]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-[var(--color-primary)]" />
              <div>
                <p className="font-semibold text-[var(--color-text)]">Địa chỉ</p>
                <a
                  href={COMPANY_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block text-sm leading-7 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                >
                  {COMPANY_CONFIG.address}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PhoneCall className="mt-1 h-5 w-5 text-[var(--color-primary)]" />
              <div>
                <p className="font-semibold text-[var(--color-text)]">Hotline</p>
                <div className="mt-1 space-y-1 text-sm leading-7 text-[var(--color-text-muted)]">
                  {COMPANY_CONFIG.phones.map((phone) => (
                    <a
                      key={phone.raw}
                      href={`tel:${phone.raw}`}
                      className="block hover:text-[var(--color-primary)]"
                    >
                      {phone.display}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-[var(--color-primary)]" />
              <div>
                <p className="font-semibold text-[var(--color-text)]">Email</p>
                <a
                  href={`mailto:${COMPANY_CONFIG.email}`}
                  className="mt-1 block text-sm leading-7 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                >
                  {COMPANY_CONFIG.email}
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-[var(--space-8)]">
            <MessageCircle
              className="h-8 w-8 text-[var(--color-primary)]"
              aria-hidden="true"
            />
            <h2 className="mt-[var(--space-4)] text-2xl font-bold text-[var(--color-text)]">
              Kênh tiếp nhận nhanh
            </h2>
            <p className="mt-[var(--space-4)] leading-7 text-[var(--color-text-muted)]">
              Zalo phù hợp nhất để gửi ảnh và vị trí công trình. Nếu hạng mục
              cần xử lý gấp, hãy gọi trực tiếp kỹ sư.
            </p>
            <div className="mt-[var(--space-6)] flex flex-col gap-[var(--space-3)] sm:flex-row">
              <Button href={COMPANY_CONFIG.socials.zalo1} external>
                Gửi thông tin qua Zalo
              </Button>
              <Button
                href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
                variant="ghost"
              >
                Gọi {COMPANY_CONFIG.phones[0].display}
              </Button>
            </div>
            <Alert
              title="Chưa có biểu mẫu CRM trực tuyến"
              className="mt-[var(--space-8)]"
            >
              Website hiện chưa gửi dữ liệu biểu mẫu vào hệ thống lưu trữ bền
              vững. Vì vậy giao diện chỉ hiển thị các kênh tiếp nhận thực đang
              hoạt động.
            </Alert>
          </Card>
        </Container>
      </section>
    </main>
  );
}
