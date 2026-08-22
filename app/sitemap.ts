import type {MetadataRoute} from 'next'
import {client} from './lib/sanity'
import {eventLandings, localLandings} from './lib/seo-content'

type SitemapArticle = {slug: string; updatedAt?: string; image?: string}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await client.fetch<SitemapArticle[]>(`
    *[_type == "article" && defined(slug.current) && seo.noIndex != true] {
      "slug": slug.current,
      "updatedAt": _updatedAt,
      "image": mainImage.asset->url
    }
  `, {}, {next: {revalidate: 3600}})

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://www.mombicarespa.com/chuyen-nha/${article.slug}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
    images: article.image ? [article.image] : undefined,
  }))

  const routes = [
    {path: '', frequency: 'daily' as const, priority: 1},
    {path: '/dich-vu', frequency: 'weekly' as const, priority: 0.9},
    {path: '/dich-vu/cham-soc-da', frequency: 'weekly' as const, priority: 0.8},
    {path: '/dich-vu/massage-thu-gian', frequency: 'weekly' as const, priority: 0.8},
    {path: '/chuyen-nha', frequency: 'daily' as const, priority: 0.8},
    {path: '/spa-buon-ma-thuot', frequency: 'weekly' as const, priority: 0.9},
    {path: '/uu-dai-su-kien', frequency: 'weekly' as const, priority: 0.8},
  ]

  const localUrls: MetadataRoute.Sitemap = localLandings.map((page) => ({
    url: `https://www.mombicarespa.com/spa-buon-ma-thuot/${page.slug}`,
    lastModified: new Date('2026-08-22'),
    changeFrequency: 'monthly',
    priority: 0.8,
    images: [`https://www.mombicarespa.com${page.image}`],
  }))

  const eventUrls: MetadataRoute.Sitemap = eventLandings.map((page) => ({
    url: `https://www.mombicarespa.com/uu-dai-su-kien/${page.slug}`,
    lastModified: new Date('2026-08-22'),
    changeFrequency: 'weekly',
    priority: 0.7,
    images: [`https://www.mombicarespa.com${page.image}`],
  }))

  return [
    ...routes.map(({path, frequency, priority}) => ({
      url: `https://www.mombicarespa.com${path}`,
      lastModified: new Date(),
      changeFrequency: frequency,
      priority,
    })),
    ...localUrls,
    ...eventUrls,
    ...articleUrls,
  ]
}
