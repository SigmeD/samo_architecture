import type { CabinetSpec, ZoneKey } from "@/content/types";
import { curator } from "@/content/cabinets/curator";
import { child } from "@/content/cabinets/child";
import { parent } from "@/content/cabinets/parent";
import { finance } from "@/content/cabinets/finance";
import { franchiseCurator } from "@/content/cabinets/franchise-curator";
import { franchise } from "@/content/cabinets/franchise";
import { schoolAdmin } from "@/content/cabinets/school-admin";
import { seniorCurator } from "@/content/cabinets/senior-curator";
import { lead } from "@/content/cabinets/lead";

const stub = (slug: string, title: string, code: string, emoji: string, zone: ZoneKey): CabinetSpec => ({
  slug, role: { code, title, emoji }, zone, implStatus: "planned", isStub: true,
  purpose: "Кабинет в проектировании.", coreProcess: { title: "В разработке", steps: [{ n: 1, title: "—", desc: "Раздел в проектировании." }] },
  domains: [], crossLinks: [], modules: [], sources: [],
});

export const CABINETS: Record<string, CabinetSpec> = {
  curator,
  child,
  parent,
  "school-admin":   schoolAdmin,
  franchise,
  lead,
  "senior-curator": seniorCurator,
  "franchise-curator": franchiseCurator,
  sales:            stub("sales", "Менеджер по продажам", "op-menedzher-prodazh-dnm", "💼", "teal"),
  marketer:         stub("marketer", "Маркетолог (СММ + Таргет)", "op-marketolog-dnm", "📣", "orange"),
  finance,
  guest:            stub("guest", "Гость (онбординг)", "guest", "🚪", "green"),
};

export const getCabinet = (slug: string): CabinetSpec | undefined => CABINETS[slug];
export const getAllCabinetSlugs = (): string[] => Object.keys(CABINETS);
