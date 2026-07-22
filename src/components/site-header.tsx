import Link from 'next/link';
import { Menu, Phone } from 'lucide-react';
import { company } from '@/content/company';

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur'>
      <div className='mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link href='/' className='flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white'>
            ĐHP
          </div>
          <div>
            <div className='text-sm font-bold tracking-[0.2em] text-slate-900'>
              {company.shortName}
            </div>
            <div className='text-[11px] uppercase tracking-[0.3em] text-slate-500'>
              Cơ khí • Xây dựng • Nội thất
            </div>
          </div>
        </Link>

        <nav className='hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex'>
          <a href='#gioi-thieu' className='transition hover:text-slate-900'>Giới thiệu</a>
          <a href='#dich-vu' className='transition hover:text-slate-900'>Dịch vụ</a>
          <a href='#du-an' className='transition hover:text-slate-900'>Dự án</a>
          <a href='#lien-he' className='transition hover:text-slate-900'>Liên hệ</a>
        </nav>

        <div className='hidden items-center gap-3 md:flex'>
          <a
            href={`tel:${company.primaryPhone.replace(/\./g, '')}`}
            className='inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900'
          >
            <Phone size={16} /> {company.primaryPhone}
          </a>
          <a
            href='#lien-he'
            className='rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700'
          >
            Nhận báo giá
          </a>
        </div>

        <button className='inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 md:hidden'>
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
