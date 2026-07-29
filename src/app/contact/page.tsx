import type { Metadata } from "next";
import { Bot, Mail, MapPin, PhoneCall } from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { COMPANY_CONFIG } from "@/content/company";

const CONTACT_DESCRIPTION =
  "Lập hồ sơ tư vấn kỹ thuật với Đại Hải Phát, sau đó gửi ảnh hiện trạng qua Zalo hoặc gọi kỹ sư để xác nhận khảo sát.";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: CONTACT_DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Liên hệ Đại Hải Phát",
    description: CONTACT_DESCRIPTION,
    url: `${COMPANY_CONFIG.websiteUrl}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <PageHero
        eyebrow="Liên hệ kỹ thuật"
        title="Lập hồ sơ trước khi xác nhận khảo sát"
        description="Bắt đầu với trợ lý AI để ghi nhận hạng mục, vị trí và kích thước dự kiến. Sau đó gửi ảnh hiện trạng qua Zalo hoặc gọi kỹ sư khi cần trao đổi nhanh."
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
            <Bot
              className="h-8 w-8 text-[var(--color-primary)]"
              aria-hidden="true"
            />
            <h2 className="mt-[var(--space-4)] text-2xl font-bold text-[var(--color-text)]">
              Bắt đầu hồ sơ tư vấn
            </h2>
            <p className="mt-[var(--space-4)] leading-7 text-[var(--color-text-muted)]">
              Trợ lý AI giúp thu thập dữ liệu theo từng bước trước khi bàn giao cho
              đội ngũ kỹ thuật. Zalo phù hợp để gửi ảnh hiện trạng; hotline dành
              cho trường hợp cần trao đổi ngay.
            </p>
            <div className="mt-[var(--space-6)] flex flex-col flex-wrap gap-[var(--space-3)] sm:flex-row">
              <Button href="/#ai-office">Lập hồ sơ với AI</Button>
              <Button
                href={COMPANY_CONFIG.socials.zalo1}
                variant="ghost"
                external
              >
                Gửi ảnh qua Zalo
              </Button>
              <Button
                href={`tel:${COMPANY_CONFIG.phones[0].raw}`}
                variant="ghost"
              >
                Gọi {COMPANY_CONFIG.phones[0].display}
              </Button>
            </div>
            <Alert
              title="Chỉ bàn giao khi khách hàng đồng ý"
              className="mt-[var(--space-8)]"
            >
              Hồ sơ AI được lưu trên thiết bị trong quá trình nhập. Thông tin chỉ
              được gửi cho Đại Hải Phát khi anh/chị hoàn tất hồ sơ và đồng ý bàn
              giao. Ảnh hiện trạng có thể gửi riêng qua Zalo.
            </Alert>
          </Card>
        </Container>
      </section>
    </main>
  );
}
