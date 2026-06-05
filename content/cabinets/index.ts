import type { CabinetSpec, ZoneKey } from "@/content/types";
import { curator } from "@/content/cabinets/curator";

const stub = (slug: string, title: string, code: string, emoji: string, zone: ZoneKey): CabinetSpec => ({
  slug, role: { code, title, emoji }, zone, implStatus: "planned", isStub: true,
  purpose: "Кабинет в проектировании.", coreProcess: { title: "В разработке", steps: [{ n: 1, title: "—", desc: "Раздел в проектировании." }] },
  domains: [], crossLinks: [], modules: [], sources: [],
});

export const CABINETS: Record<string, CabinetSpec> = {
  curator,
  child:            stub("child", "Ученик", "cr4-rebenok-dnm", "🎓", "green"),
  parent:           stub("parent", "Родитель", "cr5-roditel-dnm", "👨‍👩‍👧", "blue"),
  "school-admin":   stub("school-admin", "Администратор школы", "op-admin-shkoly-dnm", "🏫", "orange"),
  franchise:        stub("franchise", "Франчайзи / директор", "pr2-franchayzi-dnm", "🏢", "purple"),
  lead:             stub("lead", "Руководитель проекта", "br7-rukovoditel-dnm", "🎯", "blue"),
  "senior-curator": stub("senior-curator", "Старший куратор", "op-starshiy-kurator-dnm", "🧑‍💼", "teal"),
  "franchise-curator": stub("franchise-curator", "Куратор франшиз", "op-kurator-franshiz-dnm", "🤝", "purple"),
  sales:            stub("sales", "Менеджер по продажам", "op-menedzher-prodazh-dnm", "💼", "teal"),
  finance:          stub("finance", "Бухгалтер", "op-finansist-dnm", "📊", "gold"),
  guest:            stub("guest", "Гость (онбординг)", "guest", "🚪", "green"),
};

export const getCabinet = (slug: string): CabinetSpec | undefined => CABINETS[slug];
export const getAllCabinetSlugs = (): string[] => Object.keys(CABINETS);
