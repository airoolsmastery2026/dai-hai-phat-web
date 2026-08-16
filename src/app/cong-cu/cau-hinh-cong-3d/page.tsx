import type { Metadata } from "next";

import { GodotGateConfigurator } from "@/components/ai/GodotGateConfigurator";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

const PAGE_TITLE = "Cấu hình cửa cổng 3D";
const PAGE_DESCRIPTION =
  "Thử kích thước và kiểu nan cửa cổng trong bộ cấu hình 3D Đại Hải Phát trước khi chuyển phương án sang trợ lý tư vấn và kỹ sư xác nhận.";
const DEFAULT_CONFIGURATOR_URL = "/godot/gate-configurator/index.html";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/cong-cu/cau-hinh-cong-3d" },
};

export default function GateConfiguratorPage() {
  const configuratorUrl =
    process.env.NEXT_PUBLIC_GODOT_GATE_CONFIGURATOR_URL?.trim() ||
    DEFAULT_CONFIGURATOR_URL;

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <PageHero
        eyebrow="3D tương tác · Kỹ sư xác nhận"
        title="Thử phương án cửa cổng trước khi khảo sát"
        description="Điều chỉnh phương án trực quan trong Godot rồi chuyển cấu hình sang trợ lý tư vấn Đại Hải Phát. Công cụ không thay thế khảo sát, thiết kế kỹ thuật hoặc báo giá chính thức."
      />

      <section className="py-[var(--space-section)] lg:py-[var(--space-section-lg)]">
        <Container>
          <GodotGateConfigurator configuratorUrl={configuratorUrl} />
        </Container>
      </section>
    </main>
  );
}
