import type { ZoneKey } from "@/content/types";

export interface MetaChip { label: string; value?: string; unverified?: boolean }
export interface CoreEngine { emoji: string; title: string; feats: string[] }

export interface OverviewCabinet {
  slug: string;
  emoji: string;
  name: string;
  roleCaption: string;
  zone: ZoneKey;
  hero?: boolean;
  highlights: string[];
}
export interface OverviewTier { title: string; cabinets: OverviewCabinet[] }

export interface FlowStep { k: string; v: string; variant?: "alt" | "end" }
export interface FlowBand { emoji: string; title: string; note?: string; steps: FlowStep[]; branch?: FlowStep[] }

export interface CrossModule { label: string; zone: ZoneKey }
export interface DataGroup { label: string; items: string[] }
export interface ResultBanner { emoji: string; title: string; sub: string }

export interface OverviewSpec {
  header: { eyebrow: string; title: string; lead: string; meta: MetaChip[] };
  core: CoreEngine;
  tiers: OverviewTier[];
  processes: FlowBand[];
  crossModules: CrossModule[];
  dataLayer: DataGroup[];
  result: ResultBanner;
}
