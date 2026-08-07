import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {SiteFooter, SiteHeader} from '../components/SiteChrome'

export const metadata: Metadata = {
  title: 'Dịch vụ chăm sóc da & massage | Mombi Care Spa',
  description: 'Khám phá dịch vụ chăm sóc da, gội đầu dưỡng sinh và massage thư giãn tại Mombi Care Spa Buôn Ma Thuột.',
  alternates: {canonical: '/dich-vu'},
}

const serviceGroups = [
  {
    number: '01',
    title: 'Chăm sóc da',
    eyebrow: 'Nuôi dưỡng & phục hồi',
    description: 'Liệu trình được lựa chọn theo tình trạng da thực tế, từ làm sạch cơ bản đến chăm sóc chuyên sâu và phục hồi.',
    image: '/img/skin-care.jpg',
    href: '/dich-vu/cham-soc-da',
    services: ['Chăm sóc da', 'Cấy HA căng bóng', 'Lấy nhân mụn'],
    count: '09 liệu trình',
  },
  {
    number: '02',
    title: 'Massage thư giãn',
    eyebrow: 'Thả lỏng & cân bằng',
    description: 'Những khoảng nghỉ dành cho cơ thể với gội đầu dưỡng sinh, massage cổ vai gáy, massage body và chăm sóc đôi chân.',
    image: '/img/massage body mombi care spa.jpg',
    href: '/dich-vu/massage-thu-gian',
    services: ['Gội đầu dưỡng sinh', 'Massage cổ vai gáy', 'Massage body'],
    count: '11 liệu trình',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#26351f]">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-[#dfe8d9] bg-[#eef4e9] px-5 py-20 md:py-28">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#b8cda9]/50" />
          <div aria-hidden="true" className="absolute -right-8 -top-8 h-52 w-52 rounded-full border border-[#b8cda9]/60" />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#729557]">Dịch vụ tại Mombi</p>
                <h1 className="max-w-4xl font-serif text-5xl leading-[1.08] tracking-[-0.025em] text-[#26351f] md:text-7xl">
                  Một khoảng nghỉ<br className="hidden sm:block" /> dành riêng cho bạn
                </h1>
              </div>
              <p className="max-w-lg border-l border-[#9db78a] pl-6 text-sm font-light leading-7 text-[#5b6c52] md:text-base md:leading-8">
                Mombi lắng nghe nhu cầu của bạn trước khi bắt đầu. Chọn nhóm dịch vụ phù hợp và xem rõ từng liệu trình, thời lượng cùng mức giá.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-24">
          <div className="space-y-8 md:space-y-12">
            {serviceGroups.map((service, index) => (
              <article key={service.href} className="group grid overflow-hidden rounded-[1.75rem] border border-[#dfe7d9] bg-white shadow-[0_18px_60px_rgba(44,62,35,0.07)] lg:grid-cols-2">
                <Link href={service.href} className={`relative min-h-[360px] overflow-hidden bg-[#dfe9d7] md:min-h-[500px] ${index % 2 ? 'lg:order-2' : ''}`}>
                  <Image src={service.image} alt={`${service.title} tại Mombi Care Spa`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f2d19]/45 via-transparent to-transparent" />
                  <span className="absolute bottom-6 left-6 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md">{service.count}</span>
                </Link>
                <div className="flex min-h-[430px] flex-col justify-between p-7 md:p-12 lg:p-14">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#e6ece1] pb-7">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#789b5e]">{service.eyebrow}</p>
                      <span className="font-serif text-2xl text-[#a7bb98]">{service.number}</span>
                    </div>
                    <h2 className="mt-9 font-serif text-4xl tracking-[-0.02em] text-[#26351f] md:text-5xl">{service.title}</h2>
                    <p className="mt-5 max-w-xl text-sm font-light leading-7 text-[#607058] md:text-base md:leading-8">{service.description}</p>
                    <ul className="mt-8 flex flex-wrap gap-2" aria-label={`Dịch vụ nổi bật: ${service.title}`}>
                      {service.services.map((item) => <li key={item} className="rounded-full bg-[#f1f5ed] px-4 py-2 text-xs text-[#526748]">{item}</li>)}
                    </ul>
                  </div>
                  <Link href={service.href} className="mt-10 inline-flex w-fit items-center gap-4 rounded-full bg-[#789f5d] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#62864a]">
                    Xem bảng dịch vụ <span aria-hidden="true" className="text-base">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 pb-16 md:px-8 md:pb-24">
          <div className="mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-[1.75rem] bg-[#26351f] px-7 py-10 text-white md:grid-cols-[1fr_auto] md:px-12 md:py-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b8d1a7]">Bạn chưa biết nên chọn gì?</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">Nhắn Mombi để được tư vấn liệu trình phù hợp</h2>
            </div>
            <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center rounded-full bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#26351f] transition hover:bg-[#eef4e9]">Tư vấn qua Zalo</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
