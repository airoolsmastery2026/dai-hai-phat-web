import { ChevronDown } from "lucide-react";

import type { ServiceFaqItem } from "@/types/content";

function FAQItem({ item }: { item: ServiceFaqItem }) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-left">
        <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
        <ChevronDown className="h-5 w-5 text-[#FF5722] transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-slate-200 px-6 py-4">
        <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
      </div>
    </details>
  );
}

export function ServiceFAQ({ items }: { items: ServiceFaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <FAQItem key={item.question} item={item} />
      ))}
    </div>
  );
}
