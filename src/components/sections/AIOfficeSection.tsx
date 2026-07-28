"use client";

import { Bot, Check, ClipboardList, Gauge, MemoryStick, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const serviceOptions = [
  "Cửa cổng",
  "Cầu thang & lan can",
  "Mái che",
  "Hàng rào",
  "Nhà xưởng",
  "Nội thất",
];

const materialOptions = ["Sắt / thép", "Inox", "Nhôm kính", "Gỗ / MDF", "Chưa xác định"];

type Answers = {
  service?: string;
  material?: string;
};

export function AIOfficeSection() {
  const [answers, setAnswers] = useState<Answers>({});
  const step = answers.service ? (answers.material ? 3 : 2) : 1;
  const confidence = step === 1 ? 15 : step === 2 ? 35 : 55;
  const options = step === 1 ? serviceOptions : step === 2 ? materialOptions : [];

  const question = useMemo(() => {
    if (step === 1) return "Bạn cần tư vấn hạng mục nào?";
    if (step === 2) return "Bạn đang ưu tiên vật liệu nào?";
    return "Để hoàn thiện proposal, vui lòng chuẩn bị kích thước, ảnh hiện trạng và vị trí công trình.";
  }, [step]);

  const selectOption = (option: string) => {
    if (step === 1) setAnswers({ service: option });
    if (step === 2) setAnswers((current) => ({ ...current, material: option }));
  };

  return (
    <section id="ai-office" className="scroll-mt-16 bg-slate-950 py-16 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">AI Digital Engineering Office</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Bắt đầu hồ sơ tư vấn kỹ thuật</h2>
          <p className="mt-4 leading-7 text-slate-300">Mỗi bước chỉ có một câu hỏi. AI không tự đoán thông số và proposal chính thức sẽ được kỹ sư xác nhận sau khảo sát.</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500"><Bot aria-hidden="true" /></span>
                <div><p className="font-bold">Trợ lý kỹ thuật Đại Hải Phát</p><p className="text-sm text-emerald-400">Sẵn sàng tư vấn</p></div>
              </div>
              <button type="button" onClick={() => setAnswers({})} className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-slate-300 hover:text-white" aria-label="Bắt đầu lại">
                <RotateCcw className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-7 rounded-2xl bg-slate-900 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Câu hỏi {Math.min(step, 3)}</p>
              <h3 className="mt-2 text-xl font-bold leading-7">{question}</h3>
            </div>

            {options.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {options.map((option) => (
                  <button key={option} type="button" onClick={() => selectOption(option)} className="min-h-12 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-left font-semibold transition hover:border-orange-400 hover:bg-orange-400/10 focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <a href="#contact" className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-5 py-3 font-bold hover:bg-orange-600">
                Gửi thông tin để kỹ sư tiếp tục
              </a>
            )}
          </div>

          <aside className="grid gap-4">
            <StatusCard icon={ClipboardList} title="Working Timeline">
              <ol className="space-y-3 text-sm">
                {["Hạng mục", "Vật liệu", "Hiện trạng & kích thước", "Proposal sơ bộ"].map((item, index) => (
                  <li key={item} className={`flex items-center gap-3 ${index + 1 < step ? "text-white" : "text-slate-400"}`}>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${index + 1 < step ? "bg-emerald-500" : index + 1 === step ? "bg-orange-500 text-white" : "bg-slate-800"}`}>
                      {index + 1 < step ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
                    </span>{item}
                  </li>
                ))}
              </ol>
            </StatusCard>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <StatusCard icon={MemoryStick} title="Memory">
                <p className="text-sm text-slate-300">{answers.service ?? "Chưa chọn hạng mục"}</p>
                {answers.material && <p className="mt-1 text-sm text-slate-300">{answers.material}</p>}
              </StatusCard>
              <StatusCard icon={Gauge} title="Confidence">
                <p className="text-2xl font-black text-orange-400">{confidence}%</p>
                <p className="text-xs text-slate-400">Mức hoàn thiện dữ liệu</p>
              </StatusCard>
            </div>

            <StatusCard icon={ClipboardList} title="Proposal">
              <p className="text-sm leading-6 text-slate-300">
                {answers.service
                  ? `Đang xây dựng phương án ${answers.service.toLowerCase()}${answers.material ? ` với ưu tiên ${answers.material.toLowerCase()}` : ""}.`
                  : "Proposal sẽ cập nhật theo từng câu trả lời của bạn."}
              </p>
              <p className="mt-2 text-xs text-slate-500">Báo giá chính thức sau khảo sát thực tế.</p>
            </StatusCard>
          </aside>
        </div>
      </div>
    </section>
  );
}

function StatusCard({ icon: Icon, title, children }: { icon: typeof Bot; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-200">
        <Icon className="h-4 w-4 text-orange-400" aria-hidden="true" /> {title}
      </div>
      {children}
    </div>
  );
}
