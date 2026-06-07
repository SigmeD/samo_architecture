import type { ResultBanner as ResultBannerT } from "@/content/overview-types";

export function ResultBanner({ banner }: { banner: ResultBannerT }) {
  return (
    <div className="result-band-bg mt-5 flex items-center gap-4 rounded-2xl border border-samo-green-b px-6 py-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-samo-green-b bg-white text-2xl" aria-hidden="true">{banner.emoji}</div>
      <div>
        <div className="font-display text-lg font-extrabold text-samo-green-d">{banner.title}</div>
        <div className="mt-1 text-xs text-green-soft">{banner.sub}</div>
      </div>
    </div>
  );
}
