"use client";

import Link from "next/link";

const menus = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Nội thất",
    href: "#services",
  },
  {
    title: "Cơ khí",
    href: "#services",
  },
  {
    title: "Dự án",
    href: "#projects",
  },
  {
    title: "Giới thiệu",
    href: "#about",
  },
  {
    title: "Liên hệ",
    href: "#contact",
  },
];

export function SiteNavigation() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link
          href="/"
          className="flex flex-col"
        >
          <span className="text-2xl font-black uppercase tracking-wide text-white">
            ĐẠI HẢI PHÁT
          </span>

          <span className="text-xs uppercase tracking-[0.35em] text-orange-400">
            Nội thất & Cơ khí dân dụng
          </span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">

          {menus.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="text-sm font-semibold uppercase tracking-wider text-white transition hover:text-orange-400"
            >
              {item.title}
            </a>
          ))}

        </nav>

        <div className="hidden items-center gap-4 lg:flex">

          <a
            href="tel:0900000000"
            className="rounded-xl border border-orange-500 px-6 py-3 font-bold text-orange-400 transition hover:bg-orange-500 hover:text-white"
          >
            0900 000 000
          </a>

          <a
            href="#contact"
            className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            Báo giá
          </a>

        </div>

      </div>

    </header>
  );
}
