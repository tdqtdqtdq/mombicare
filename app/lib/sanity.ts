// sa-spa-landing/app/lib/sanity.ts
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "t9rcsg51",
  dataset: "production",
  apiVersion: "2026-08-01",
  useCdn: true,
});

export function formatPublishedDate(value?: string) {
  if (!value) return "Mới cập nhật";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
