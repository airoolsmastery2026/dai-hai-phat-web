import type { ServiceProcessStep } from "@/types/content";

export function ServiceProcess({ steps }: { steps: ServiceProcessStep[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step.title} className="relative">
          <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition hover:shadow-md">
            <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5722] to-orange-600 text-white font-bold shadow-lg">
              {index + 1}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
