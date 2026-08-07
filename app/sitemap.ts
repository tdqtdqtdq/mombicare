import type {MetadataRoute} from 'next'
import {client} from './lib/sanity'

type SitemapArticle = {slug: string; updatedAt?: string}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await client.fetch<SitemapArticle[]>(`
    *[_type == "article" && defined(slug.current) && seo.noIndex != true] {
      "slug": slug.current,
      "updatedAt": _updatedAt
    }
  `, {}, {next: {revalidate: 3600}})

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://www.mombicarespa.com/chuyen-nha/${article.slug}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const routes = [
    {path: '', frequency: 'daily' as const, priority: 1},
    {path: '/dich-vu', frequency: 'weekly' as const, priority: 0.9},
    {path: '/dich-vu/cham-soc-da', frequency: 'weekly' as const, priority: 0.8},
    {path: '/dich-vu/massage-thu-gian', frequency: 'weekly' as const, priority: 0.8},
    {path: '/chuyen-nha', frequency: 'daily' as const, priority: 0.8},
  ]

  return [
    ...routes.map(({path, frequency, priority}) => ({
      url: `https://www.mombicarespa.com${path}`,
      lastModified: new Date(),
      changeFrequency: frequency,
      priority,
    })),
    ...articleUrls,
  ]
}
