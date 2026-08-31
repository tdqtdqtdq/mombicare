import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {SiteFooter, SiteHeader, LuxuryFloatingConcierge} from '../components/SiteChrome'

export const metadata: Metadata = {
  title: 'Bảng Giá Dịch Vụ Spa Buôn Ma Thuột - Chăm Sóc Da & Massage Trị Liệu',
  description: 'Bảng giá dịch vụ spa niêm yết tại Buôn Ma Thuột (34 Trần Khánh Dư): Gội đầu dưỡng sinh từ 50k, massage cổ vai gáy, massage body tinh dầu, cấy HA, lấy nhân mụn chuẩn y khoa. Không tip bắt buộc.',
  alternates: {canonical: 'https://www.mombicarespa.com/dich-vu'},
  openGraph: {
    title: 'Bảng Giá Dịch Vụ Spa Buôn Ma Thuột - Chăm Sóc Da & Massage | Mombi Care',
    description: 'Bảng giá niêm yết minh bạch các liệu trình chăm sóc da và massage thư giãn tại Buôn Ma Thuột.',
    url: 'https://www.mombicarespa.com/dich-vu',
  },
}

const serviceGroups = [
  {
    number: '01',
    title: 'Chăm sóc da chuyên biệt',
    eyebrow: 'Nuôi dưỡng & Phục hồi',
    description: 'Liệu trình được lựa chọn theo tình trạng da thực tế, từ làm sạch cơ bản, lấy nhân mụn chuẩn y khoa đến cấy HA căng bóng và điện di tinh chất.',
    image: '/img/skin-care.jpg',
    href: '/dich-vu/cham-soc-da',
    services: ['Cấy HA căng bóng', 'Chăm sóc da chuyên sâu', 'Lấy nhân mụn chuẩn y khoa', 'Massage mặt Thái chí'],
    count: '09 Liệu trình',
  },
  {
    number: '02',
    title: 'Massage & Thư giãn',
    eyebrow: 'Thả lỏng & Cân bằng năng lượng',
    description: 'Những khoảng nghỉ dành riêng cho cơ thể với gội đầu dưỡng sinh thảo mộc, massage cổ vai gáy giải cơ và massage body tinh dầu.',
    image: '/img/massage body mombi care spa.jpg',
    href: '/dich-vu/massage-thu-gian',
    services: ['Gội đầu dưỡng sinh', 'Massage cổ vai gáy', 'Massage body tinh dầu', 'Giải bó cơ chuyên sâu'],
    count: '11 Liệu trình',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c2619]">
      <SiteHeader />
      <main>
        {/* Luxury Hero Header */}
        <section className="relative overflow-hidden border-b border-[#dce7d6] bg-[#edf4e8] px-5 py-16 sm:py-24 md:py-32">
          {/* Ambient lighting */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#6f9556]/15 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute left-10 bottom-0 h-80 w-80 rounded-full bg-[#c6a35d]/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-end gap-8 sm:gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-[#6f9556]">
                  <span className="h-px w-6 bg-[#6f9556]" />
                  Bảng Dịch Vụ Mombi Care Spa
                </div>
                <h1 className="font-serif text-[2.75rem] font-normal leading-[1.04] text-[#1c2619] sm:text-6xl md:text-7xl">
                  Một khoảng nghỉ<br className="hidden sm:block" /> dành riêng cho bạn.
                </h1>
              </div>
              <p className="max-w-lg border-l-2 border-[#6f9556]/60 pl-6 text-sm font-light leading-7 text-[#55694f] md:text-base md:leading-8">
                Mombi luôn bắt đầu bằng việc lắng nghe cơ thể bạn. Chọn nhóm liệu trình bên dưới để xem rõ chi tiết từng bước, thời lượng và mức giá niêm yết minh bạch.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Showcase */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
          <div className="space-y-10 sm:space-y-14 md:space-y-16">
            {serviceGroups.map((service, index) => (
              <article 
                key={service.href} 
                className="group grid overflow-hidden rounded-[2.5rem] border border-[#dce7d6] bg-white shadow-[0_20px_50px_rgba(28,40,24,0.06)] transition duration-500 hover:shadow-[0_28px_65px_rgba(28,40,24,0.12)] lg:grid-cols-2"
              >
                <Link 
                  href={service.href} 
                  className={`relative aspect-[4/3] min-h-[300px] overflow-hidden bg-[#dfe9d7] sm:min-h-[400px] md:min-h-[480px] ${index % 2 ? 'lg:order-2' : ''}`}
                >
                  <Image 
                    src={service.image} 
                    alt={`${service.title} tại Mombi Care Spa`} 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 50vw" 
                    className="object-cover transition duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#142012]/55 via-transparent to-transparent" />
                  <span className="absolute bottom-5 left-5 rounded-full border border-white/40 bg-black/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    {service.count}
                  </span>
                </Link>

                <div className="flex flex-col justify-between p-7 sm:p-10 md:p-14 lg:p-16">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#e5eee1] pb-6">
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6f9556]">
                        {service.eyebrow}
                      </p>
                      <span className="font-serif text-3xl font-light text-[#c6a35d]">
                        {service.number}
                      </span>
                    </div>

                    <h2 className="mt-6 font-serif text-3xl font-normal text-[#1c2619] sm:text-4xl md:text-5xl">
                      {service.title}
                    </h2>
                    
                    <p className="mt-4 text-sm font-light leading-7 text-[#586c52] md:text-base md:leading-8">
                      {service.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {service.services.map((item) => (
                        <span key={item} className="rounded-xl bg-[#edf4e8] px-3.5 py-1.5 text-xs font-medium text-[#3b5034]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10">
                    <Link 
                      href={service.href} 
                      className="group/btn inline-flex min-h-12 items-center gap-4 rounded-full bg-[#24361e] px-7 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-md transition duration-300 hover:bg-[#395330] hover:shadow-lg"
                    >
                      <span>Xem bảng giá chi tiết</span>
                      <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Booking Consultation Banner */}
        <section className="px-4 pb-16 sm:px-6 sm:pb-24 md:px-8 md:pb-32">
          <div className="mx-auto grid max-w-7xl items-center gap-6 overflow-hidden rounded-[2.5rem] bg-[#1a2916] p-8 text-white sm:p-12 md:grid-cols-[1fr_auto] md:p-14 lg:p-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a9c994]">Bạn chưa biết nên chọn liệu trình nào?</p>
              <h2 className="mt-3 font-serif text-3xl font-normal text-white sm:text-4xl">
                Nhắn Mombi để được tư vấn gói phù hợp nhất.
              </h2>
            </div>
            <a 
              href="https://zalo.me/0934250909" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#6f9556] px-8 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#80aa64]"
            >
              Tư vấn nhanh qua Zalo →
            </a>
          </div>
        </section>
      </main>
      <LuxuryFloatingConcierge />
      <SiteFooter />
    </div>
  )
}

