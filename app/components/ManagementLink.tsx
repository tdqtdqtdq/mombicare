import Link from "next/link";

export function ManagementLink() {
  return (
    <Link
      href="/quan-ly"
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-black/15 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 transition hover:bg-white hover:text-[#182515]"
    >
      <span aria-hidden="true">⌘</span>
      Quản lý nội bộ
    </Link>
  );
}
