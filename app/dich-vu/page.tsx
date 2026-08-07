import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {SiteFooter, SiteHeader} from '../components/SiteChrome'

export const metadata: Metadata = {
  title: 'Dịch vụ chăm sóc da & massage | Mombi Care Spa',
  description: 'Khám phá dịch vụ chăm sóc da chuyên sâu, gội đầu dưỡng sinh và massage trị liệu tại Mombi Care Spa Buôn Ma Thuột.',
  alternates: {canonical: '/dich-vu'},
}

const serviceGroups = [
  {
    title: 'Chăm sóc da cao cấp',
    eyebrow: 'Chăm sóc & phục hồi',
    description: 'Liệu trình chăm sóc da, cấy HA và xử lý mụn được thiết kế theo tình trạng da thực tế.',
    image: '/img/skin-care.jpg',
    href: '/dich-vu/cham-soc-da',
    cta: 'Xem dịch vụ chăm sóc da',
  },
  {
    title: 'Thư giãn & Massage',
    eyebrow: 'Thả lỏng & cân bằng',
    description: 'Gội đầu dưỡng sinh, massage cổ vai gáy và massage body giúp cơ thể tìm lại nhịp nghỉ vừa vặn.',
    image: '/img/massage body mombi care spa.jpg',
    href: '/dich-vu/massage-thu-gian',
    cta: 'Xem dịch vụ massage',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f1] text-[#2d3d25]">
      <SiteHeader />
      <main>
        <section className="bg-[#edf3e8] px-5 py-16 text-center md:py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#789f5d]">Chăm sóc trọn vẹn</p>
          <h1 className="font-serif text-5xl leading-tight text-[#293922] md:text-7xl">Dịch vụ tại Mombi</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-8 text-[#596a51]">Chọn hành trình phù hợp với nhu cầu của bạn. Mỗi liệu trình đều được thực hiện trong không gian riêng tư và thư thái.</p>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:px-8 md:py-20">
          {serviceGroups.map((service) => (
            <Link key={service.href} href={service.href} className="group overflow-hidden rounded-[2rem] border border-[#dfe8d9] bg-white shadow-[0_10px_35px_rgba(45,61,37,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(45,61,37,0.14)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#e4edd9]">
                <Image src={service.image} alt={service.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#23301d]/35 via-transparent to-transparent" />
              </div>
              <div className="p-7 md:p-9">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#789f5d]">{service.eyebrow}</p>
                <h2 className="font-serif text-3xl text-[#2d3d25] md:text-4xl">{service.title}</h2>
                <p className="mt-4 text-sm font-light leading-7 text-[#5f6e58]">{service.description}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6f9555] transition-all group-hover:gap-3">{service.cta} <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
