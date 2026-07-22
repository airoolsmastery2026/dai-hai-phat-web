"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Phone, Menu, X, ArrowRight, ShieldCheck, 
  Navigation, Send, CheckCircle2, Loader2, Bot, Sparkles, MessageCircle,
  Building2, Wrench, Cpu, Calendar, ChevronRight, Cabinet, Layers,
  Bed, Tv, Check
} from "lucide-react";

// ==========================================
// THÔNG TIN CÔNG TY & CẤU HÌNH BÁN HÀNG
// ==========================================
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
    { label: "Năm Kinh Nghiệm", value: "15+" },
    { label: "Dự Án Đã Thi Công", value: "850+" },
    { label: "Mẫu Thiết Kế 3D", value: "1,200+" },
    { label: "Mức Độ Hài Lòng", value: "99%" },
  ]
};

// DỊCH VỤ THI CÔNG NỘI THẤT & CƠ KHÍ
const SERVICES = [
  {
    id: 1,
    title: "Nội Thất Gỗ MDF Melamine & Cánh Kính Khung Nhôm",
    desc: "Sản xuất Giường ngủ thông minh, Tủ quần áo kịch trần, Kệ Tivi bằng gỗ MDF lõi xanh chống ẩm phủ Melamine cao cấp.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    icon: Cabinet
  },
  {
    id: 2,
    title: "Vách Tường Trang Trí, Lam Sóng & Tấm Ốp Composite",
    desc: "Thi công vách ngăn phòng, vách Tivi nhựa Composite vân đá/vân gỗ, tấm ốp tường Nano hiện đại chịu nước 100%.",
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
    icon: Layers
  },
  {
    id: 3,
    title: "Mái Che & Tấm Lợp Nhựa Đặc Composite Chịu Lực",
    desc: "Lắp đặt mái che lấy sáng, mái hiên sân thượng dùng tấm nhựa đặc Composite/Polycarbonate chống tia UV, chịu lực đập mạnh.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    icon: Wrench
  },
  {
    id: 4,
    title: "Kết Cấu Thép, Cửa Cổng & Gia Công Cơ Khí CNC",
    desc: "Thi công nhà xưởng, khung kèo thép tiền chế, cửa cổng kết cấu sắt sơn tĩnh điện & gia công cắt laser chính xác.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    icon: Building2
  }
];

// BÀI VIẾT BỔ SUNG CHUYÊN SÂU NỘI THẤT DESIGNER & VẬT LIỆU COMPOSITE
const ARTICLES = [
  {
    id: 1,
    title: "Giải Pháp Thiết Kế Tủ Quần Áo Gỗ MDF Lõi Xanh Phủ Melamine Cánh Kính 2026",
    category: "Gỗ Công Nghiệp MDF",
    date: "22/07/2026",
    author: "Designer Đại Hải Phát",
    excerpt: "Ưu điểm chống cong vênh, chống mối mọt của ván MDF lõi xanh Melamine kết hợp khung nhôm định hình nhúng LED sang trọng.",
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Mẫu Giường Ngủ Khung Thép Kết Hợp Tab Đầu Giường Gỗ MDF Melamine Hiện Đại",
    category: "Nội Thất Phòng Ngủ",
    date: "21/07/2026",
    author: "KTS Nguyễn Văn Hùng",
    excerpt: "Kết hợp khung cơ khí chắc chắn chịu tải 500kg với bề mặt gỗ MDF phủ Melamine vân gỗ tự nhiên siêu thẩm mỹ.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Thi Công Mái Che Tấm Lợp Nhựa Đặc Composite Chịu Lực & Chống Tia UV",
    category: "Vật Liệu Composite",
    date: "19/07/2026",
    author: "Đội Thi Công Cơ Khí",
    excerpt: "Tấm lợp đặc nhựa Composite độ bền trên 20 năm, không mục nát, chịu mưa bão và cách nhiệt tối ưu cho giếng trời, mái hiên.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Trang Trí Vách Tường Tivi Với Tấm Ốp Nhựa Composite & Lam Sóng Cao Cấp",
    category: "Vách Tường Trang Trí",
    date: "17/07/2026",
    author: "Ban Thiết Kế ĐHP",
    excerpt: "Sự kết hợp giữa vách nhựa Composite giả đá, lam sóng PVC và kệ Tivi MDF treo tường nâng tầm không gian phòng khách.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  }
];

export default function DaiHaiPhatModernPlatform() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", content: `Xin chào! Tôi là AI Trợ Lý Kỹ Thuật & Thiết Kế Đại Hải Phát. Anh/chị cần tư vấn thi công Nội thất Gỗ MDF Melamine, Nhựa Composite hay Kết cấu cơ khí?` }
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
          content: `Cảm ơn anh/chị. Đội ngũ KTS & Kỹ sư Đại Hải Phát sẵn sàng đến tận nơi khảo sát, lên bản vẽ 3D và gửi báo giá chi tiết. Vui lòng liên hệ Hotline/Zalo ${COMPANY_CONFIG.primaryPhone} để được phục vụ nhanh nhất!` 
        }
      ]);
      setAiLoading(false);
    }, 1000);
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=${COMPANY_CONFIG.coordinates.lat},${COMPANY_CONFIG.coordinates.lng}&z=16&output=embed`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* 1. TOP BAR */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 md:px-8 border-b border-slate-800">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span>📍 {COMPANY_CONFIG.address}</span>
          </div>
          <div className="flex items-center gap-6">
            <span>✉️ {COMPANY_CONFIG.email}</span>
            <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="text-[#FF5722] font-semibold hover:underline">
              📞 Hotline: {COMPANY_CONFIG.phones[0].display}
            </a>
          </div>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#FF5722] flex items-center justify-center font-bold text-white text-xl font-mono shadow-md">
              ĐHP
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 tracking-wider leading-tight">
                ĐẠI HẢI PHÁT
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
                C CƠ KHÍ & NỘI THẤT DESIGNER
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a href="#dich-vu" className="hover:text-[#FF5722] transition-colors">Dịch Vụ</a>
            <a href="#tin-tuc" className="hover:text-[#FF5722] transition-colors">Bài Viết Thiết Kế</a>
            <a href="#ban-do" className="hover:text-[#FF5722] transition-colors">Vị Trí Xưởng</a>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a href="#bao-gia" className="px-6 py-2.5 bg-[#FF5722] hover:bg-orange-600 text-white font-semibold text-sm rounded-lg transition-all shadow-md">
              Nhận Báo Giá
            </a>
          </div>

          <button className="lg:hidden p-2 text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-amber-400 text-xs font-semibold uppercase mb-6">
                <ShieldCheck className="w-4 h-4 text-[#FF5722]" /> Gỗ MDF Melamine – Composite – Kết Cấu Thép
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
                THIẾT KẾ NỘI THẤT <br />
                <span className="text-[#FF5722]">& THI CÔNG CƠ KHÍ</span> CAO CẤP
              </h1>
              <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed mb-8">
                Chuyên gia công & thi công Giường ngủ, Tủ quần áo, Kệ Tivi bằng gỗ MDF Melamine, vách nhựa Composite & Mái che nhựa đặc Composite chịu lực cực bền.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#bao-gia" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF5722] hover:bg-orange-600 text-white font-semibold rounded-lg shadow-lg transition-all">
                  Yêu Cầu Báo Giá 3D <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#tin-tuc" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all">
                  Xem Bài Viết Kỹ Thuật
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80" 
                  alt="Nội Thất Gỗ MDF Melamine Đại Hải Phát" 
                  className="w-full h-[420px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATS */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {COMPANY_CONFIG.stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-3xl md:text-4xl font-extrabold text-[#FF5722] mb-1">{stat.value}</div>
                <div className="text-slate-600 text-xs font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SERVICES */}
      <section id="dich-vu" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#FF5722] text-xs font-bold uppercase tracking-wider">Lĩnh Vực Sản Xuất</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">DỊCH VỤ CƠ KHÍ & NỘI THẤT</h2>
            <div className="w-16 h-1 bg-[#FF5722] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => {
              const IconComp = s.icon;
              return (
                <div key={s.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-md rounded-xl text-[#FF5722] shadow-md">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#FF5722] transition-colors leading-snug">{s.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4 flex-grow">{s.desc}</p>
                    <a href="#bao-gia" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5722] hover:gap-2 transition-all">
                      Tư Vấn Thiết Kế <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. ARTICLES SHOWCASE */}
      <section id="tin-tuc" className="py-20 bg-white border-t border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[#FF5722] text-xs font-bold uppercase tracking-wider">Chuyên Mục Sưu Tầm & Kỹ Thuật</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">BÀI VIẾT NỘI THẤT & COMPOSITE</h2>
            </div>
            <a href="#tin-tuc" className="inline-flex items-center gap-2 text-sm font-bold text-[#FF5722] hover:underline">
              Xem Tất Cả Bài Viết <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARTICLES.map((article) => (
              <article key={article.id} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="h-44 overflow-hidden relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#FF5722] text-white text-[10px] font-bold rounded-full">
                    {article.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 hover:text-[#FF5722] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4 flex-grow line-clamp-3">
                    {article.excerpt}
                  </p>
                  <a href="#bao-gia" className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-[#FF5722]">
                    Đọc Chi Tiết <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LOCATION MAP */}
      <section id="ban-do" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-[#FF5722] text-xs font-bold uppercase tracking-wider">Trụ Sở & Xưởng Sản Xuất</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">ĐẾN THĂM XƯỞNG ĐẠI HẢI PHÁT</h2>
              <p className="text-slate-600 text-sm mt-1">{COMPANY_CONFIG.address}</p>
            </div>
            <a href={COMPANY_CONFIG.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
              <Navigation className="w-4 h-4 text-[#FF5722]" /> Chỉ Đường Google Maps
            </a>
          </div>
          <div className="w-full h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative">
            <iframe title="Vị trí Đại Hải Phát" src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
          </div>
        </div>
      </section>

      {/* 8. FORM BÁO GIÁ */}
      <section id="bao-gia" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto bg-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-extrabold mb-2">BÁO GIÁ NỘI THẤT & MÁI CHE COMPOSITE</h2>
              <p className="text-slate-300 text-sm">Gửi yêu cầu để nhận bản vẽ 3D và báo giá chi tiết Gỗ MDF Melamine, Nhựa Composite & Cơ khí trong 2 giờ.</p>
            </div>

            {formSubmitted ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2">Gửi Yêu Cầu Thành Công!</h3>
                <p className="text-slate-300 text-sm">Cảm ơn Quý khách. Đội ngũ KTS & Kỹ sư sẽ liên hệ tư vấn ngay.</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-2 text-slate-300">Họ và Tên *</label>
                    <input type="text" required placeholder="Nguyễn Văn A" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-2 text-slate-300">Số Điện Thoại *</label>
                    <input type="tel" required placeholder="0785505518" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-2 text-slate-300">Hạng Mục Cần Báo Giá</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]">
                    <option>Giường, Tủ quần áo, Kệ Tivi bằng gỗ MDF Melamine</option>
                    <option>Vách tường Tivi, Vách ngăn nhựa Composite / CNC</option>
                    <option>Mái che bằng tấm lợp nhựa đặc Composite chịu lực</option>
                    <option>Kết cấu thép nhà xưởng & Gia công cơ khí CNC</option>
                  </select>
                </div>
                <button type="submit" disabled={formLoading} className="w-full py-4 bg-[#FF5722] hover:bg-orange-600 font-bold text-white rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg">
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Gửi Yêu Cầu Báo Giá Nhanh</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 text-xs text-slate-400 text-center">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. Tất cả quyền được bảo lưu.</p>
          <p className="mt-2 text-slate-500">Hotline: {COMPANY_CONFIG.phones[0].display} - {COMPANY_CONFIG.phones[1].display} | Email: {COMPANY_CONFIG.email}</p>
        </div>
      </footer>

      {/* FLOATING BUTTONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a href={COMPANY_CONFIG.socials.zalo1} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xl hover:scale-110 transition-all">ZALO</a>
        <a href={COMPANY_CONFIG.socials.whatsapp1} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all"><MessageCircle className="w-6 h-6" /></a>
        <a href={`tel:${COMPANY_CONFIG.phones[0].raw}`} className="w-12 h-12 rounded-full bg-[#FF5722] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all animate-pulse"><Phone className="w-6 h-6" /></a>
      </div>

      {/* AI CONSULTANT WIDGET */}
      <div className="fixed bottom-24 right-6 z-50">
        {!aiOpen && (
          <button onClick={() => setAiOpen(true)} className="flex items-center gap-2 px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all">
            <Sparkles className="w-4 h-4 text-[#FF5722] animate-spin" />
            <span className="text-xs font-bold uppercase">AI Tư Vấn Vật Liệu</span>
          </button>
        )}

        {aiOpen && (
          <div className="w-[340px] sm:w-[380px] h-[480px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#FF5722]" />
                <span className="text-xs font-bold">AI Tư Vấn Đại Hải Phát</span>
              </div>
              <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-3 text-xs bg-slate-50">
              {aiMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl ${m.role === "user" ? "bg-[#FF5722] text-white" : "bg-white text-slate-800 border border-slate-200 shadow-sm"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {aiLoading && <div className="text-slate-500 text-xs flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> AI đang xử lý...</div>}
            </div>
            <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAiSend()} placeholder="Nhập câu hỏi..." className="flex-grow bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#FF5722]" />
              <button onClick={handleAiSend} className="p-2 bg-[#FF5722] text-white rounded-lg"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
