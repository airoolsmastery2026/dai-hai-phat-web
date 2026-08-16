import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { COMPANY_CONFIG } from "@/content/company";

const CONTACT_DESCRIPTION =
  "Gửi nhu cầu, ảnh hiện trạng và kích thước dự kiến cho Đại Hải Phát để kỹ sư tiếp nhận và xác nhận bước khảo sát tiếp theo.";

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
        title="Gửi hiện trạng — trao đổi trực tiếp với đúng người"
        description="Gửi ảnh, kích thước dự kiến và vị trí công trình qua Zalo; hoặc gọi trực tiếp khi cần kỹ sư tiếp nhận nhanh trước bước khảo sát."
        imageSrc="/images/factory/factory01.webp"
        imageAlt="Không gian xưởng và đội ngũ kỹ thuật Đại Hải Phát"
        imagePosition="65% center"
        highlights={["Zalo nhận ảnh hiện trạng", "Hotline trao đổi nhanh", "Kỹ sư tiếp nhận trực tiếp"]}
        actions={
          <>
            <Button href={COMPANY_CONFIG.socials.zalo1} external>
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Gửi nhu cầu qua Zalo
            </Button>
            <Button href={`tel:${COMPANY_CONFIG.phones[0].raw}`} variant="secondary">
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Gọi {COMPANY_CONFIG.phones[0].display}
            </Button>
          </>
        }
      />

      <section className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
        <Container className="grid gap-[var(--space-4)] lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="space-y-[var(--space-3)] p-[var(--space-4)] sm:p-[var(--space-5)]">
            <ContactItem icon={MapPin} label="Địa chỉ">
              <a
                href={COMPANY_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--color-primary)]"
              >
                {COMPANY_CONFIG.address}
              </a>
            </ContactItem>
            <ContactItem icon={PhoneCall} label="Hotline">
              {COMPANY_CONFIG.phones.map((phone) => (
                <a
                  key={phone.raw}
                  href={`tel:${phone.raw}`}
                  className="mr-[var(--space-3)] inline-block hover:text-[var(--color-primary)]"
                >
                  {phone.display}
                </a>
              ))}
            </ContactItem>
            <ContactItem icon={Mail} label="Email">
              <a href={`mailto:${COMPANY_CONFIG.email}`} className="break-all hover:text-[var(--color-primary)]">
                {COMPANY_CONFIG.email}
              </a>
            </ContactItem>
          </Card>

          <Card className="p-[var(--space-4)] sm:p-[var(--space-5)]">
            <MessageCircle className="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 className="mt-[var(--space-2)] text-xl font-bold text-[var(--color-text)]">
              Trao đổi đúng người, đúng hạng mục
            </h2>
            <p className="mt-[var(--space-2)] max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Zalo phù hợp để gửi ảnh hiện trạng. Hotline dành cho trường hợp cần trao đổi ngay về phạm vi công việc.
            </p>
            <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] sm:flex-row">
              <Button href="/ai-tu-van?ai=1">
                Tư vấn AI trước
              </Button>
              <Button href="/bao-gia" variant="secondary">
                Chuẩn bị báo giá
              </Button>
            </div>
            <p className="mt-[var(--space-3)] text-xs leading-5 text-[var(--color-text-subtle)]">
              Báo giá chính thức chỉ được lập sau khi thông tin hiện trạng và phạm vi công việc được xác nhận.
            </p>
          </Card>
        </Container>
      </section>
    </main>
  );
}

function ContactItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-[var(--space-3)] border-b border-[var(--color-border)] pb-[var(--space-3)] last:border-b-0 last:pb-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text)]">{label}</p>
        <div className="mt-[var(--space-1)] text-sm leading-6 text-[var(--color-text-muted)]">{children}</div>
      </div>
    </div>
  );
}
