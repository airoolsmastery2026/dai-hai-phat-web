import { company } from '@/content/company';

export function SiteFooter() {
  return (
    <footer className='border-t border-slate-200 bg-slate-950 text-slate-300'>
      <div className='mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8'>
        <div>
          <div className='text-lg font-bold text-white'>{company.shortName}</div>
          <p className='mt-3 max-w-md text-sm leading-6 text-slate-400'>
            {company.tagline}
          </p>
        </div>
        <div>
          <div className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-200'>Liên hệ</div>
          <div className='mt-3 space-y-2 text-sm text-slate-400'>
            <p>{company.address}</p>
            <p>{company.email}</p>
            <p>{company.primaryPhone} • {company.secondaryPhone}</p>
          </div>
        </div>
        <div>
          <div className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-200'>Kết nối</div>
          <div className='mt-3 flex flex-col gap-2 text-sm text-slate-400'>
            <a href={company.websiteUrl} className='transition hover:text-white'>Website</a>
            <a href={company.googleMapsUrl} className='transition hover:text-white'>Google Maps</a>
          </div>
        </div>
      </div>
      <div className='border-t border-slate-800 py-4 text-center text-xs text-slate-500'>
        © {new Date().getFullYear()} {company.name}. All rights reserved.
      </div>
    </footer>
  );
}
