import Image from "next/image";
import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";

type ArticleImage = {
  _type: "image";
  url?: string;
  alt?: string;
  caption?: string;
  dimensions?: { width: number; height: number; aspectRatio: number };
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-6 text-[16px] leading-8 text-[#4f5f48] md:text-[17px]">{children}</p>,
    h2: ({ children }) => <h2 className="mb-5 mt-12 font-serif text-3xl leading-tight text-[#2d3d25] md:text-4xl">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-4 mt-10 font-serif text-2xl leading-snug text-[#34452b] md:text-3xl">{children}</h3>,
    h4: ({ children }) => <h4 className="mb-3 mt-8 text-lg font-semibold text-[#34452b]">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="my-9 rounded-r-2xl border-l-4 border-[#91b875] bg-[#f3f7ef] px-6 py-5 font-serif text-xl italic leading-8 text-[#425638]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-7 ml-5 list-disc space-y-2 text-[#4f5f48] marker:text-[#83a968]">{children}</ul>,
    number: ({ children }) => <ol className="mb-7 ml-5 list-decimal space-y-2 text-[#4f5f48] marker:font-semibold marker:text-[#6f9555]">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-2 leading-8">{children}</li>,
    number: ({ children }) => <li className="pl-2 leading-8">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[#2d3d25]">{children}</strong>,
    em: ({ children }) => <em className="italic text-[#43533c]">{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http");
      return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="font-medium text-[#6f9555] underline decoration-[#a9c794] underline-offset-4 hover:text-[#557a3c]">{children}</a>;
    },
  },
  types: {
    image: ({ value }: { value: ArticleImage }) => {
      if (!value.url) return null;
      const width = value.dimensions?.width || 1200;
      const height = value.dimensions?.height || 800;
      return (
        <figure className="my-10">
          <div className="overflow-hidden rounded-2xl bg-[#eef3e9] shadow-sm">
            <Image src={value.url} alt={value.alt || "Hình ảnh trong bài viết Mombi Care Spa"} width={width} height={height} sizes="(max-width: 900px) 100vw, 760px" className="h-auto w-full object-cover" />
          </div>
          {value.caption && <figcaption className="mt-3 text-center text-sm italic text-[#72806b]">{value.caption}</figcaption>}
        </figure>
      );
    },
  },
  unknownType: ({ value }) => <p className="my-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Nội dung “{value._type}” chưa được hỗ trợ hiển thị.</p>,
};

export function ArticleBody({ value }: { value?: PortableTextBlock[] }) {
  if (!Array.isArray(value) || value.length === 0) {
    return <p className="rounded-2xl bg-[#f3f7ef] p-6 text-[#5c6e51]">Bài viết đang được Mombi hoàn thiện.</p>;
  }
  return <div className="article-body"><PortableText value={value} components={components} /></div>;
}
