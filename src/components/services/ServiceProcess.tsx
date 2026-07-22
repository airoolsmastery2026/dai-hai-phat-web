import type { ServiceProcessStep } from "@/types/content";

export function ServiceProcess({ steps }: { steps: ServiceProcessStep[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF5722]">Bước {index + 1}</p>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
