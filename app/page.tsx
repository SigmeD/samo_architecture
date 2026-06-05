import { PosterLayout } from "@/components/atlas/poster-layout";
import { PosterHero } from "@/components/atlas/poster-hero";
import { FunnelFlow } from "@/components/atlas/funnel-flow";
import { RoleTier } from "@/components/atlas/role-tier";
import { Legend } from "@/components/atlas/legend";
import { overview } from "@/content/overview";
import { getCabinet } from "@/content/cabinets";

export default function Home() {
  return (
    <PosterLayout zone="blue">
      <PosterHero title={overview.hero.title} lead={overview.hero.lead} />
      <FunnelFlow steps={overview.funnel} />
      {overview.tiers.map((t) => (
        <RoleTier key={t.title} title={t.title} caption={t.caption}
          cabinets={t.cabinetSlugs.map((s) => getCabinet(s)!).filter(Boolean)} />
      ))}
      <Legend />
    </PosterLayout>
  );
}
