import type { ReactNode } from "react";

export function PosterFrame({ children }: { children: ReactNode }) {
  return (
    <div className="poster-page-bg min-h-screen w-full px-4 py-7 md:px-7">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-line bg-white pb-7 shadow-[0_26px_70px_-24px_rgba(11,44,82,0.34)]">
        <div className="poster-top-bar absolute inset-x-0 top-0 h-[7px]" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
