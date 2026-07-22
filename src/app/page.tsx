"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Phone, Menu, X, ArrowRight, ShieldCheck, 
  Navigation, Send, CheckCircle2, Loader2, Bot, Sparkles, MessageCircle 
} from "lucide-react";

const COMPANY_CONFIG = {
  name: "CÔNG TY TNHH CƠ KHÍ XÂY DỰNG ĐẠI HẢI PHÁT",
  shortName: "ĐẠI HẢI PHÁT",
  phones: [
    { display: "0785.505.518", raw: "0785505518" },
    { display: "0328.721.724", raw: "0328721724" }
  ],
  primaryPhone: "0785.505.518",
  email: "daihaiphat83@gmail.com",
  address: "DL12, Khu phố 3B, Thới Hòa, TP. Hồ Chí Minh 820000, Việt Nam",
  coordinates: { lat: 11.1042833, lng: 106.6294283 },
  googleMapsUrl: "https://www.google.com/maps/place/CTY+TNHH+C%C6%A0+KH%C3%8D+X%C3%82Y+D%E1%BB%B0NG+%C4%90%E1%BA%A0I+H%E1%BA%A2I+PH%C3%81T/@11.1042833,106.6294283,17z",
  websiteUrl: "https://dai-hai-phat-web.vercel.app",
  socials: {
    zalo1: "https://zalo.me/0785505518",
    whatsapp1: "https://wa.me/84785505518",
  },
  stats: [
    { label: "Năm kinh nghiệm", value: "15+" },
    { label: "Dự án hoàn thành", value: "850+" },
    { label: "Chủ đầu tư & Đối tác", value: "320+" },
    { label: "Tỷ lệ hài lòng", value: "99%" },
  ]
};

export default function DaiHaiPhatPlatform() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", content: `Xin chào! Tôi là AI Trợ Lý Kỹ Thuật Đại Hải Phát. Anh/chị cần tư vấn báo giá Kết cấu thép, Gia công CNC hay Cổng lan can mái che?` }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 1200);
  };

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
          content: `Cảm ơn anh/chị. Kỹ sư Đại Hải Phát sẵn sàng tư vấn chi tiết. Anh/chị vui lòng liên hệ Zalo/Hotline ${COMPANY_CONFIG.primaryPhone} hoặc gửi bản vẽ qua email ${COMPANY_CONFIG.email} để nhận báo giá chính xác nhất!` 
        }
      ]);
      setAiLoading(false);
    }, 1000);
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=${COMPANY_CONFIG.coordinates.lat},${COMPANY_CONFIG.coordinates.lng}&z=16&output=embed`;

  return (
    <>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <div className="min-h-screen bg-[#0B132B] text-slate-100 font-sans antialiased">
        
        {/* HEADER */}
        <header className="sticky top-0 z-40 w-full bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-800">
          <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF5722] flex items-center justify-center font-bold text-white text-xl font-mono shadow-lg">
                ĐHP
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base md:text-lg text-white tracking-wider leading-tight">
                  ĐẠI HẢI PHÁT
                </span>
                <span className="text-[9px] text-slate-400 font-medium tracking-widest uppercase">
                  CƠ KHÍ & XÂY DỰNG
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#gioi-thieu" className="hover:text-[#FF5722] transition-colors">Giới Thiệu</a>
              <a href="#dich-vu" className="hover:text-[#FF5722] transition-colors">Dịch Vụ</a>
              <a href="#du-an" className="hover:text-[#FF5722] transition-colors">Dự Án</a>
              <a href="#ban-do" className="hover:text-[#FF5722] transition-colors">Vị Trí Xưởng</a>
            </nav>

            <div className="hidden lg:flex items-center gap-6">
              <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-[#FF5722]">
                <Phone className="w-4 h-4 text-[#FF5722] animate-pulse" />
                {COMPANY_CONFIG.phones[0].display}
              </a>
              <a href="#bao-gia" className="px-5 py-2.5 bg-[#FF5722] hover:bg-orange-600 text-white font-semibold text-sm rounded-md transition-all">
                Nhận Báo Giá
              </a>
            </div>

            <button className="lg:hidden p-2 text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* HERO */}
        <section className="relative w-full min-h-[75vh] bg-[#0B132B] flex items-center border-b border-slate-800 py-16">
          <div className="container mx-auto px-4 md:px-8 relative z-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-500 text-xs font-medium uppercase mb-6">
                <ShieldCheck className="w-4 h-4 text-[#FF5722]" /> Tiêu chuẩn kỹ thuật ISO
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-100 leading-tight mb-6">
                GIẢI PHÁP CƠ KHÍ <br />
                <span className="text-[#FF5722]">KẾT CẤU THÉP</span> TOÀN DIỆN
              </h1>
              <p className="text-base md:text-xl text-slate-300 font-light leading-relaxed mb-8">
                Thi công chính xác – Đúng tiến độ – Đảm bảo chất lượng. Chuyên gia công kết cấu thép, nhà xưởng, máy CNC và nội thất công nghiệp cao cấp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#bao-gia" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF5722] hover:bg-orange-600 text-white font-semibold rounded-md transition-all">
                  Nhận Báo Giá Thi Công <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#ban-do" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-md">
                  Thăm Xưởng Sản Xuất
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-12 bg-slate-950 border-b border-slate-800">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {COMPANY_CONFIG.stats.map((stat, idx) => (
                <div key={idx} className="p-4">
                  <div className="text-3xl md:text-5xl font-bold text-[#FF5722] mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-xs uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MAP */}
        <section id="ban-do" className="py-20 bg-slate-900 border-b border-slate-800">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <span className="text-[#FF5722] text-xs font-semibold uppercase tracking-wider">Trụ Sở & Xưởng Sản Xuất</span>
                <h2 className="text-2xl md:text-4xl font-bold text-white mt-1">ĐẾN THAM THUẬN VẬN HÀNH ĐẠI HẢI PHÁT</h2>
                <p className="text-slate-400 text-sm mt-2">{COMPANY_CONFIG.address}</p>
              </div>
              <a href={COMPANY_CONFIG.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-md border border-slate-700">
                <Navigation className="w-4 h-4 text-[#FF5722]" /> Mở Chỉ Đường Google Maps
              </a>
            </div>
            <div className="w-full h-[380px] rounded-xl overflow-hidden border border-slate-800 relative">
              <iframe title="Vị trí Đại Hải Phát" src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
            </div>
          </div>
        </section>

        {/* FORM BÁO GIÁ */}
        <section id="bao-gia" className="py-20 bg-slate-950">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">YÊU CẦU BÁO GIÁ THI CÔNG</h2>
                <p className="text-slate-400 text-sm">Gửi thông tin dự án để Kỹ sư Đại Hải Phát liên hệ tư vấn trong 2 giờ.</p>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-bold text-white mb-2">Gửi Yêu Cầu Thành Công!</h3>
                  <p className="text-slate-400 text-sm">Cảm ơn Quý khách. Kỹ sư sẽ liên hệ lại ngay.</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Họ và Tên *</label>
                      <input type="text" required placeholder="Nguyễn Văn A" className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Số Điện Thoại *</label>
                      <input type="tel" required placeholder="0785505518" className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Hạng Mục Cần Báo Giá</label>
                    <select className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]">
                      <option>Kết cấu thép / Nhà thép tiền chế</option>
                      <option>Gia công CNC chính xác</option>
                      <option>Cổng, Lan can, Mái che</option>
                      <option>Thi công công trình theo yêu cầu</option>
                    </select>
                  </div>
                  <button type="submit" disabled={formLoading} className="w-full py-4 bg-[#FF5722] hover:bg-orange-600 font-semibold text-white rounded-md transition-all flex items-center justify-center gap-2">
                    {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Gửi Yêu Cầu Báo Giá</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-950 border-t border-slate-800 py-10 text-xs text-slate-500 text-center">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. Tất cả quyền được bảo lưu.</p>
            <p className="mt-2 text-slate-600">Hotline: {COMPANY_CONFIG.phones[0].display} - {COMPANY_CONFIG.phones[1].display} | Email: {COMPANY_CONFIG.email}</p>
          </div>
        </footer>

        {/* FLOATING BUTTONS */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <a href={COMPANY_CONFIG.socials.zalo1} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-lg hover:scale-110 transition-all">ZALO</a>
          <a href={COMPANY_CONFIG.socials.whatsapp1} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"><MessageCircle className="w-6 h-6" /></a>
          <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="w-12 h-12 rounded-full bg-[#FF5722] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all animate-pulse"><Phone className="w-6 h-6" /></a>
        </div>

        {/* AI WIDGET */}
        <div className="fixed bottom-24 right-6 z-50">
          {!aiOpen && (
            <button onClick={() => setAiOpen(true)} className="flex items-center gap-2 px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all">
              <Sparkles className="w-4 h-4 text-[#FF5722] animate-spin" />
              <span className="text-xs font-semibold uppercase">AI Trợ Lý Báo Giá</span>
            </button>
          )}

          {aiOpen && (
            <div className="w-[340px] sm:w-[380px] h-[480px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#FF5722]" />
                  <span className="text-xs font-bold text-white">AI Tư Vấn Đại Hải Phát</span>
                </div>
                <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-grow p-4 overflow-y-auto space-y-3 text-xs">
                {aiMessages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl ${m.role === "user" ? "bg-[#FF5722] text-white" : "bg-slate-900 text-slate-200 border border-slate-800"}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {aiLoading && <div className="text-slate-500 text-xs flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> AI đang xử lý...</div>}
              </div>
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAiSend()} placeholder="Nhập câu hỏi..." className="flex-grow bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5722]" />
                <button onClick={handleAiSend} className="p-2 bg-[#FF5722] text-white rounded-md"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
