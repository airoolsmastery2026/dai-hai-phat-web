import { Award } from "lucide-react";

import type { CERTIFICATES } from "@/content/factory";

export function Certificates({ data }: { data: typeof CERTIFICATES }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#FF5722]">Certificates</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-900">Chứng chỉ & Công nhân</h2>
      <p className="mt-3 max-w-2xl text-base text-slate-600">Đạt chuẩn quốc tế và được công nhân bởi các tổ chức uy tín hàng đầu.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {data.map((cert) => {
          const isExpiringSoon = new Date(cert.expiry).getFullYear() - new Date().getFullYear() <= 1;

          return (
            <div key={cert.name} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{cert.year}</div>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">{cert.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{cert.scope}</p>

              <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Phát hành bởi:</span>
                  <span className="font-semibold text-slate-900">{cert.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Hết hạn:</span>
                  <span className={`font-semibold ${isExpiringSoon ? "text-orange-600" : "text-green-600"}`}>{cert.expiry}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
