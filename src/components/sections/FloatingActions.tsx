"use client";

import { MessageCircle, Phone, Sparkles, X, Bot, Send, Loader2 } from "lucide-react";
import { useState } from "react";

import { COMPANY_CONFIG } from "@/content/company";

export function FloatingActions() {
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      role: "assistant",
      content: `Xin chào! Tôi là AI Trợ Lý Kỹ Thuật & Thiết Kế Đại Hải Phát. Anh/chị cần tư vấn thi công Nội thất Gỗ MDF Melamine, Nhựa Composite hay Kết cấu cơ khí?`,
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiSend = () => {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = { role: "user", content: aiInput };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput("");
    setAiLoading(true);

    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Cảm ơn anh/chị. Đội ngũ KTS & Kỹ sư Đại Hải Phát sẵn sàng đến tận nơi khảo sát, lên bản vẽ 3D và gửi báo giá chi tiết. Vui lòng liên hệ Hotline/Zalo ${COMPANY_CONFIG.primaryPhone} để được phục vụ nhanh nhất!`,
        },
      ]);
      setAiLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a href={COMPANY_CONFIG.socials.zalo1} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xl transition-all hover:scale-110">ZALO</a>
        <a href={COMPANY_CONFIG.socials.whatsapp1} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-all hover:scale-110"><MessageCircle className="h-6 w-6" /></a>
        <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-[#FF5722] text-white shadow-xl transition-all hover:scale-110"><Phone className="h-6 w-6" /></a>
      </div>

      <div className="fixed bottom-24 right-6 z-50">
        {!aiOpen ? (
          <button onClick={() => setAiOpen(true)} className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-3 text-white shadow-2xl transition-all hover:scale-105">
            <Sparkles className="h-4 w-4 animate-spin text-[#FF5722]" />
            <span className="text-xs font-bold uppercase">AI Tư Vấn Vật Liệu</span>
          </button>
        ) : (
          <div className="flex h-[480px] w-[340px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[380px]">
            <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-[#FF5722]" />
                <span className="text-xs font-bold">AI Tư Vấn Đại Hải Phát</span>
              </div>
              <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-grow space-y-3 overflow-y-auto bg-slate-50 p-4 text-xs">
              {aiMessages.map((message, idx) => (
                <div key={`${message.role}-${idx}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl p-3 ${message.role === "user" ? "bg-[#FF5722] text-white" : "border border-slate-200 bg-white text-slate-800 shadow-sm"}`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {aiLoading ? <div className="flex items-center gap-2 text-slate-500"><Loader2 className="h-3 w-3 animate-spin" /> AI đang xử lý...</div> : null}
            </div>
            <div className="flex gap-2 border-t border-slate-200 bg-white p-3">
              <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAiSend()} placeholder="Nhập câu hỏi..." className="flex-grow rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-xs text-slate-800 focus:border-[#FF5722] focus:outline-none" />
              <button onClick={handleAiSend} className="rounded-lg bg-[#FF5722] p-2 text-white"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
