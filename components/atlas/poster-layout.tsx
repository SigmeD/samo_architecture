import type { ReactNode } from "react";
import { zoneColor } from "@/content/zones";
import type { ZoneKey } from "@/content/types";

export function PosterLayout({ zone = "blue", children }: { zone?: ZoneKey; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1660px] px-4 py-6">
      <div className="h-2 w-full rounded-t" style={{ background: zoneColor(zone) }} />
      <main className="border border-t-0 border-gray-200 p-4 md:p-6">{children}</main>
    </div>
  );
}
