import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {SiteFooter, SiteHeader} from '@/app/components/SiteChrome'
import {client} from '@/app/lib/sanity'

type Service = {title: string; time: string; price: string; desc: string}
type RelatedArticle = {_id: string; title: string; slug: string; excerpt?: string}
type Props = {params: Promise<{slug: string}>}

async function getRelatedArticles(): Promise<RelatedArticle[]> {
  return client.fetch(`
    *[_type == "article" && defined(slug.current) && seo.noIndex != true]
      | order(publishedAt desc)[0...3] {
        _id,
        title,
        "slug": slug.current,
        excerpt
      }
  `, {}, {next: {revalidate: 60}})
}

const skincareServices: Service[] = [
  {title: 'Chăm sóc da cơ bản', time: '60 phút', price: '150.000đ', desc: 'Làm sạch sâu, nuôi dưỡng, massage thư giãn và bảo vệ làn da.'},
  {title: 'Cấy HA căng bóng da', time: '90 phút', price: '410.000đ', desc: 'Bổ sung độ ẩm, hỗ trợ da căng mịn và tươi tắn hơn.'},
  {title: 'Cấy tinh chất DNA cá hồi', time: '90 phút', price: '490.000đ', desc: 'Liệu trình chăm sóc và phục hồi dành cho làn da cần tái tạo.'},
  {title: 'Massage mặt Thái chí', time: '75 phút', price: '310.000đ', desc: 'Thả lỏng cơ mặt, hỗ trợ tuần hoàn và mang lại vẻ hồng hào tự nhiên.'},
  {title: 'Massage mặt + Cấy tảo + Điện di', time: '75 phút', price: '330.000đ', desc: 'Kết hợp thư giãn, làm sạch và đưa dưỡng chất chăm sóc vào da.'},
  {title: 'Cấy serum dưỡng sáng da', time: '90 phút', price: '350.000đ', desc: 'Nuôi dưỡng làn da sáng, đều màu và hỗ trợ cải thiện sắc tố.'},
  {title: 'Lấy nhân mụn', time: '60 phút', price: '250.000đ', desc: 'Làm sạch nhân mụn với dụng cụ tiệt trùng và quy trình chăm sóc phù hợp.'},
  {title: 'Lấy nhân mụn chuyên sâu', time: '120 phút', price: '350.000đ', desc: 'Dành cho tình trạng nhiều nhân mụn, kết hợp các bước làm dịu và phục hồi.'},
  {title: 'Chăm sóc da chuyên sâu', time: '70 phút', price: '200.000đ', desc: 'Quy trình chăm sóc toàn diện, điều chỉnh theo nhu cầu của làn da.'},
]

const massageServices: Service[] = [
  {title: 'Gội đầu sạch', time: '45 phút', price: '50.000đ', desc: 'Làm sạch da đầu và thư giãn nhẹ nhàng sau một ngày dài.'},
  {title: 'Gội đầu dưỡng sinh', time: '70 phút', price: '150.000đ', desc: 'Gội đầu kết hợp massage vùng đầu, cổ và vai gáy.'},
  {title: 'Massage vai cổ gáy', time: '45 phút', price: '250.000đ', desc: 'Tập trung thả lỏng vùng cổ, vai và gáy thường xuyên căng mỏi.'},
  {title: 'Massage body', time: '60 phút', price: '250.000đ', desc: 'Massage toàn thân với tinh dầu, giúp cơ thể thư giãn và phục hồi năng lượng.'},
  {title: 'Massage vai cổ gáy chuyên sâu', time: '45 phút', price: '250.000đ', desc: 'Kỹ thuật chuyên sâu tập trung vào những vùng cơ đang căng cứng.'},
  {title: 'Massage body chuyên sâu', time: '60 phút', price: '300.000đ', desc: 'Chăm sóc toàn thân với lực và kỹ thuật được điều chỉnh phù hợp.'},
  {title: 'Massage body chuyên sâu cao cấp', time: '90 phút', price: '400.000đ', desc: 'Khoảng nghỉ dài hơn với liệu trình toàn thân được chăm chút trọn vẹn.'},
  {title: 'Giải bó cơ', time: '30 – 60 phút', price: '200.000đ – 350.000đ', desc: 'Tập trung vào các vùng cơ căng cứng để cơ thể dễ vận động và thư giãn hơn.'},
  {title: 'Massage chân', time: '45 – 60 phút', price: '150.000đ – 250.000đ', desc: 'Ngâm chân, chăm sóc da và massage thư giãn hoặc chuyên sâu.'},
  {title: 'Xông hơi', time: '15 phút', price: '50.000đ', desc: 'Làm ấm và thư giãn cơ thể trước hoặc sau liệu trình.'},
  {title: 'Giác hơi', time: '15 – 20 phút', price: '50.000đ', desc: 'Liệu pháp truyền thống hỗ trợ thả lỏng vùng lưng và vai gáy.'},
]

const pageContent = {
  'cham-soc-da': {
    eyebrow: 'Nuôi dưỡng & phục hồi',
    title: 'Chăm sóc da',
    intro: 'Mỗi làn da có một nhịp riêng. Mombi bắt đầu bằng việc lắng nghe nhu cầu và lựa chọn các bước chăm sóc vừa đủ cho tình trạng da của bạn.',
    image: '/img/skin-care.jpg',
    imageAlt: 'Chăm sóc da tại Mombi Care Spa',
    services: skincareServices,
    otherHref: '/dich-vu/massage-thu-gian',
    otherLabel: 'Khám phá massage thư giãn',
  },
  'massage-thu-gian': {
    eyebrow: 'Thả lỏng & cân bằng',
    title: 'Massage thư giãn',
    intro: 'Từ gội đầu dưỡng sinh đến massage toàn thân, mỗi liệu trình là một khoảng dừng để cơ thể được thả lỏng và trở về trạng thái dễ chịu hơn.',
    image: '/img/massage body mombi care spa.jpg',
    imageAlt: 'Massage thư giãn tại Mombi Care Spa',
    services: massageServices,
    otherHref: '/dich-vu/cham-soc-da',
    otherLabel: 'Khám phá chăm sóc da',
  },
} as const

export default async function ServiceCategoryPage({params}: Props) {
  const {slug} = await params
  const content = pageContent[slug as keyof typeof pageContent]
  if (!content) notFound()
  const relatedArticles = await getRelatedArticles()

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#26351f]">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-8 md:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-[1.75rem] bg-[#edf3e8] p-7 md:p-12 lg:p-14">
            <div>
              <nav className="mb-12 flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#738468]" aria-label="Đường dẫn">
                <Link href="/dich-vu" className="hover:text-[#587643]">Dịch vụ</Link><span aria-hidden="true">/</span><span>{content.title}</span>
              </nav>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#759959]">{content.eyebrow}</p>
              <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-[-0.025em] md:text-7xl">{content.title}</h1>
              <p className="mt-7 max-w-xl text-sm font-light leading-7 text-[#596b51] md:text-base md:leading-8">{content.intro}</p>
            </div>
            <a href="https://zalo.me/0934250909" target="_blank" rel="noopener noreferrer" className="mt-12 inline-flex w-fit items-center gap-3 rounded-full bg-[#789f5d] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#63874b]">Đặt lịch tư vấn <span aria-hidden="true">→</span></a>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] bg-[#dfe8d7] md:min-h-[600px]">
            <Image src={content.image} alt={content.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl border border-white/30 bg-[#26351f]/55 px-5 py-4 text-white backdrop-blur-md md:inset-x-7 md:bottom-7">
              <span className="text-xs font-medium uppercase tracking-[0.14em]">Mombi Care Spa</span>
              <span className="text-xs text-white/80">Buôn Ma Thuột</span>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e0e7db] bg-white px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 grid gap-5 md:mb-14 md:grid-cols-[1fr_0.8fr] md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#789b5e]">Bảng dịch vụ</p>
                <h2 className="mt-4 font-serif text-4xl tracking-[-0.02em] md:text-5xl">Chọn khoảng nghỉ của bạn</h2>
              </div>
              <p className="text-sm font-light leading-7 text-[#66745f] md:text-right">Thời lượng và mức giá được hiển thị để bạn dễ lựa chọn. Mombi sẽ tư vấn lại trước khi bắt đầu liệu trình.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {content.services.map((service, index) => (
                <article key={service.title} className="group rounded-2xl border border-[#e0e7db] bg-[#fbfcf9] p-5 transition hover:border-[#b8cba9] hover:bg-[#f4f8f0] md:p-7">
                  <div className="flex gap-4">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e5eee0] text-[11px] font-semibold text-[#6d9154]">{String(index + 1).padStart(2, '0')}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 border-b border-[#e3e9df] pb-4 sm:flex-row sm:items-start sm:justify-between">
                        <h3 className="font-serif text-xl leading-snug text-[#2a3923] md:text-2xl">{service.title}</h3>
                        <p className="shrink-0 text-sm font-semibold text-[#6f9455]">{service.price}</p>
                      </div>
                      <p className="mt-4 text-sm font-light leading-6 text-[#64725d]">{service.desc}</p>
                      <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#718069]">{service.time}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {relatedArticles.length > 0 && (
          <section className="bg-[#edf3e8] px-4 py-14 md:px-8 md:py-20" aria-labelledby="service-guides-title">
            <div className="mx-auto max-w-7xl">
              <div className="mb-9 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#789b5e]">Chuyện nhà Mombi</p>
                  <h2 id="service-guides-title" className="mt-4 font-serif text-3xl tracking-[-0.02em] md:text-5xl">Đọc thêm trước khi chọn liệu trình</h2>
                </div>
                <Link href="/chuyen-nha" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#688b50] transition hover:text-[#4f7138]">Xem tất cả bài viết <span aria-hidden="true">→</span></Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedArticles.map((article) => (
                  <article key={article._id} className="rounded-2xl border border-[#d7e2d0] bg-white p-6 md:p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#82a36b]">Cẩm nang Mombi</p>
                    <h3 className="mt-4 font-serif text-2xl leading-snug text-[#2a3923]">
                      <Link href={`/chuyen-nha/${article.slug}`} className="transition hover:text-[#66894e]">{article.title}</Link>
                    </h3>
                    {article.excerpt && <p className="mt-4 line-clamp-3 text-sm font-light leading-7 text-[#64725d]">{article.excerpt}</p>}
                    <Link href={`/chuyen-nha/${article.slug}`} className="mt-6 inline-flex text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6d8f55]">Đọc bài viết <span className="ml-2" aria-hidden="true">→</span></Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-4 py-14 md:px-8 md:py-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-[#26351f] px-7 py-10 text-white md:flex-row md:items-center md:px-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b8d1a7]">Một lựa chọn khác</p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">{content.otherLabel}</h2>
            </div>
            <Link href={content.otherHref} className="rounded-full border border-white/35 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition hover:bg-white hover:text-[#26351f]">Xem dịch vụ <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
