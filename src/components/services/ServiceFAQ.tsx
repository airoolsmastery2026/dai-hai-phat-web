import type { ServiceFaqItem } from "@/types/content";

export function ServiceFAQ({ items }: { items: ServiceFaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}
