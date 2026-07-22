import { Building2, CheckCircle2, Phone, ShieldCheck } from 'lucide-react';
import { company, heroHighlights, services } from '@/content/company';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function HomePage() {
  return (
    <main className='min-h-screen bg-white text-slate-900'>
      <SiteHeader />

      <section className='relative overflow-hidden bg-slate-950 text-white'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_35%)]' />
        <div className='relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-32'>
          <div>
            <div className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200'>
              <ShieldCheck size={14} />
              Doanh nghiệp cơ khí • xây dựng • nội thất
            </div>
            <h1 className='mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl'>
              Giải pháp thi công cho doanh nghiệp và công trình thực tế.
            </h1>
            <p className='mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg'>
              {company.tagline}. Tập trung vào chất lượng, tiến độ và khả năng mở rộng lâu dài cho khách hàng.
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              <a href='#lien-he' className='rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600'>
                Nhận báo giá
              </a>
              <a href='#dich-vu' className='rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10'>
                Xem dịch vụ
              </a>
            </div>
            <div className='mt-10 grid gap-3 sm:grid-cols-2 lg:max-w-2xl'>
              {heroHighlights.map((item) => (
                <div key={item} className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200'>
                  <CheckCircle2 size={18} className='text-orange-400' />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur'>
            <div className='grid gap-4 sm:grid-cols-2'>
              {company.stats.map((stat) => (
                <div key={stat.label} className='rounded-2xl border border-white/10 bg-slate-900/60 p-5'>
                  <div className='text-3xl font-black text-orange-400'>{stat.value}</div>
                  <div className='mt-2 text-sm text-slate-300'>{stat.label}</div>
                </div>
              ))}
            </div>
            <div className='mt-6 rounded-2xl bg-slate-900 p-6'>
              <div className='flex items-center gap-3 text-sm font-semibold text-slate-200'>
                <Building2 size={18} className='text-orange-400' />
                Hồ sơ năng lực số
              </div>
              <p className='mt-3 text-sm leading-6 text-slate-400'>
                Trình bày năng lực, dự án, dịch vụ, FAQ và liên hệ theo chuẩn website doanh nghiệp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id='gioi-thieu' className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
        <div className='grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start'>
          <div>
            <div className='text-sm font-semibold uppercase tracking-[0.25em] text-orange-600'>Giới thiệu</div>
            <h2 className='mt-3 text-3xl font-bold tracking-tight sm:text-4xl'>Một nền tảng doanh nghiệp rõ ràng, dễ mở rộng.</h2>
            <p className='mt-4 text-base leading-8 text-slate-600'>
              Mục tiêu của bản v2 là tách dữ liệu, tách thành phần, tăng khả năng bảo trì và chuẩn bị sẵn cho CMS, AI và SEO.
            </p>
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            {[
              'Trang chủ doanh nghiệp',
              'Trang dịch vụ riêng',
              'Trang dự án / case study',
              'Form nhận báo giá',
            ].map((item) => (
              <div key={item} className='rounded-2xl border border-slate-200 p-5 text-sm font-medium text-slate-700 shadow-sm'>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id='dich-vu' className='border-y border-slate-200 bg-slate-50'>
        <div className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
          <div className='max-w-2xl'>
            <div className='text-sm font-semibold uppercase tracking-[0.25em] text-orange-600'>Dịch vụ</div>
            <h2 className='mt-3 text-3xl font-bold tracking-tight sm:text-4xl'>Danh mục dịch vụ cốt lõi</h2>
          </div>
          <div className='mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
            {services.map((service) => (
              <article key={service.title} className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='mb-4 inline-flex rounded-2xl bg-slate-900 p-3 text-white'>
                  <Building2 size={18} />
                </div>
                <h3 className='text-lg font-bold'>{service.title}</h3>
                <p className='mt-3 text-sm leading-7 text-slate-600'>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id='lien-he' className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
        <div className='grid gap-8 rounded-[2rem] bg-slate-900 p-8 text-white lg:grid-cols-[1.1fr_0.9fr] lg:p-12'>
          <div>
            <div className='text-sm font-semibold uppercase tracking-[0.25em] text-orange-400'>Liên hệ</div>
            <h2 className='mt-3 text-3xl font-bold tracking-tight sm:text-4xl'>Gửi yêu cầu báo giá ngay.</h2>
            <p className='mt-4 max-w-2xl text-sm leading-7 text-slate-300'>
              Cung cấp hạng mục, bản vẽ hoặc ảnh hiện trạng. Đội ngũ sẽ phản hồi nhanh qua điện thoại hoặc email.
            </p>
          </div>
          <div className='space-y-4 rounded-3xl bg-white p-6 text-slate-900'>
            <div className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>Thông tin</div>
            <div className='space-y-3 text-sm'>
              <p>{company.address}</p>
              <p>{company.email}</p>
              <p className='font-semibold'>{company.primaryPhone} • {company.secondaryPhone}</p>
            </div>
            <a href={`tel:${company.primaryPhone.replace(/\./g, '')}`} className='inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700'>
              <Phone size={16} /> Gọi ngay
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
