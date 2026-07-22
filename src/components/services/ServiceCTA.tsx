import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function ServiceCTA() {
  return (
    <section className="bg-slate-900 py-20 text-white">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-10 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Đặt lịch tư vấn</p>
            <h2 className="mt-3 text-3xl font-semibold">Sẵn sàng triển khai giải pháp cho doanh nghiệp của bạn</h2>
          </div>
          <Button href="#contact" variant="secondary">Liên hệ ngay</Button>
        </div>
      </Container>
    </section>
  );
}
