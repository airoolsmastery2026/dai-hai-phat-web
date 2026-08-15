import { ServiceBenefits } from "@/components/services/ServiceBenefits";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceFeatures } from "@/components/services/ServiceFeatures";
import { ServiceGallery } from "@/components/services/ServiceGallery";
import { ServiceOverview } from "@/components/services/ServiceOverview";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { ServiceSidebar } from "@/components/services/ServiceSidebar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import type { ServiceItem } from "@/types/content";

interface ServiceDetailContentProps {
  service: ServiceItem;
}

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  return (
    <section className="py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-12)]">
      <Container>
        <Breadcrumb
          items={[
            { label: "Dịch vụ", href: "/services" },
            { label: service.title },
          ]}
        />
        <div className="grid gap-[var(--space-6)] lg:grid-cols-[1.65fr_0.7fr] lg:gap-[var(--space-8)]">
          <div className="space-y-[var(--space-8)] sm:space-y-[var(--space-10)]">
            <ServiceOverview service={service} />

            <section aria-labelledby="service-features-title">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                Điểm chính
              </p>
              <h2
                id="service-features-title"
                className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]"
              >
                Cấu tạo và phạm vi cần lưu ý
              </h2>
              <div className="mt-[var(--space-4)]">
                <ServiceFeatures features={service.features} />
              </div>
            </section>

            <ServiceBenefits benefits={service.benefits} />

            <section aria-labelledby="service-process-title">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                Quy trình
              </p>
              <h2
                id="service-process-title"
                className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]"
              >
                Từ hiện trạng đến thi công
              </h2>
              <div className="mt-[var(--space-4)]">
                <ServiceProcess steps={service.process} />
              </div>
            </section>

            <section aria-labelledby="service-gallery-title">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                Hình ảnh
              </p>
              <h2
                id="service-gallery-title"
                className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]"
              >
                Mẫu đã được xác minh
              </h2>
              <div className="mt-[var(--space-4)]">
                <ServiceGallery images={service.gallery} title={service.title} />
              </div>
            </section>

            <section
              id="faq"
              className="scroll-mt-20"
              aria-labelledby="service-faq-title"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                Câu hỏi thường gặp
              </p>
              <h2
                id="service-faq-title"
                className="mt-[var(--space-2)] text-2xl font-bold text-[var(--color-text)]"
              >
                Cần làm rõ trước khảo sát
              </h2>
              <div className="mt-[var(--space-4)]">
                <ServiceFAQ items={service.faq} />
              </div>
            </section>
          </div>

          <div className="hidden lg:block lg:pl-[var(--space-2)]">
            <ServiceSidebar service={service} />
          </div>
        </div>
      </Container>
    </section>
  );
}
