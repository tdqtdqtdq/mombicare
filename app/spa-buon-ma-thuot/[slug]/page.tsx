import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {SeoLandingPage} from "../../components/SeoLandingPage";
import {getLocalLanding, localLandings} from "../../lib/seo-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return localLandings.map(({slug}) => ({slug}));
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
  const {slug} = await params;
  const page = getLocalLanding(slug);
  if (!page) return {};
  const path = `/spa-buon-ma-thuot/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.description,
    alternates: {canonical: path},
    openGraph: {title: page.metaTitle, description: page.description, type: "website", url: path, images: [{url: page.image, alt: page.imageAlt}]},
  };
}

export default async function LocalSeoPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const page = getLocalLanding(slug);
  if (!page) notFound();
  return <SeoLandingPage page={page} kind="local" />;
}
