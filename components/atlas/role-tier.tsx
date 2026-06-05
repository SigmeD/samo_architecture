import type { CabinetSpec } from "@/content/types";
import { CabinetBlock } from "@/components/atlas/cabinet-block";
export function RoleTier({ title, caption, cabinets }: { title: string; caption?: string; cabinets: CabinetSpec[] }) {
  return (
    <section className="my-5">
      <h2 className="font-display text-base font-bold text-samo-blue">{title}</h2>
      {caption && <p className="text-sm text-gray-600">{caption}</p>}
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cabinets.map((c) => <CabinetBlock key={c.slug} cabinet={c} />)}
      </div>
    </section>
  );
}
