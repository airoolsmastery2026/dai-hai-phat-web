import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function ServiceCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#FF5722]/10 blur-3xl" />
        <div className="absolute bottom-20 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <Container>
        <div className="relative flex flex-col items-start justify-between gap-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-12 backdrop-blur-sm md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">Yêu cầu báo giá</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">Sẵn sàng triển khai giải pháp cho doanh nghiệp của bạn</h2>
            <p className="mt-3 text-lg text-slate-300">Liên hệ với đội ngày chỉnh hôm nay để nhận báo giá và tư vấn chi tiết.</p>
          </div>
          <div className="flex-shrink-0">
            <Button href="#contact">Yêu cầu báo giá</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
