"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const menuItems = [
  { title: "Trang chủ", href: "/" },
  { title: "Nội thất", href: "#services" },
  { title: "Cơ khí", href: "#services" },
  { title: "Dự án", href: "#projects" },
  { title: "Giới thiệu", href: "#about" },
  { title: "Liên hệ", href: "#contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Track active hash
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    setActiveHash(window.location.hash);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const isMenuItemActive = (href: string) => {
    if (href === "/") {
      return activeHash === "" || activeHash === "/";
    }
    return activeHash === href;
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-200 bg-white shadow-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="text-xl font-bold text-slate-900">
            ĐẠI HẢI PHÁT
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden gap-10 lg:flex">
          {menuItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className={`text-sm font-semibold transition-colors ${
                isMenuItemActive(item.href)
                  ? "text-slate-900"
                  : isScrolled
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <a
          href="#contact"
          className="hidden rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 lg:inline-block"
        >
          Nhận báo giá
        </a>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-slate-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 top-20 border-b border-slate-200 bg-white shadow-lg lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <nav className="space-y-2 px-6 py-6">
            {menuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                onClick={handleNavClick}
                className={`block rounded-lg px-4 py-3 font-semibold transition-colors ${
                  isMenuItemActive(item.href)
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.title}
              </a>
            ))}
            <a
              href="#contact"
              onClick={handleNavClick}
              className="mt-4 block rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
            >
              Nhận báo giá
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
