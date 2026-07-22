import { Navigation } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { COMPANY_CONFIG } from "@/content/company";

const getMapEmbedUrl = ({ lat, lng }: { lat: number; lng: number }) =>
  `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

export function LocationSection() {
  const mapEmbedUrl = getMapEmbedUrl(COMPANY_CONFIG.coordinates);

  return (
    <section id="ban-do" className="bg-slate-50 py-20">
      <Container>
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF5722]">Trụ Sở & Xưởng Sản Xuất</span>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">ĐẾN THĂM XƯỞNG ĐẠI HẢI PHÁT</h2>
            <p className="mt-1 text-sm text-slate-600">{COMPANY_CONFIG.address}</p>
          </div>
          <a href={COMPANY_CONFIG.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
            <Navigation className="h-4 w-4 text-[#FF5722]" /> Chỉ Đường Google Maps
          </a>
        </div>
        <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
          <iframe title="Vị trí Đại Hải Phát" src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
        </div>
      </Container>
    </section>
  );
}
