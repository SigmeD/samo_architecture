export type ImplStatus = "done" | "partial" | "planned" | "divergent";
export type Direction = "in" | "out" | "both";
export type ZoneKey = "blue" | "green" | "orange" | "purple" | "teal" | "gold";

export interface RoleMeta { code: string; title: string; emoji: string }
export interface SourceCitation { id: string; version: string; section?: string }

export interface ProcessStep {
  n: number; title: string; desc: string;
  actors?: string[]; source?: string; gamification?: string;
  /** Метка «New» (обновление 08.06): блок новый относительно прошлого постера. Снимается при мердже в master. */
  isNew?: boolean;
}
export interface ProcessFlow {
  title: string; badge?: string; steps: ProcessStep[]; note?: string;
  /** Опц. компактный цикл-контур (короткие подписи стадий) — рендерится отдельной лентой над детальными шагами. */
  loop?: string[];
}

export interface DomainSpec {
  title: string; items: string[]; source?: string;
  readOnly?: boolean; toggleable?: boolean;
  /** Метка «New» (обновление 08.06): домен новый относительно прошлого постера. Снимается при мердже в master. */
  isNew?: boolean;
}
export interface CrossLink {
  toCabinet: string; label: string; direction: Direction; source?: string;
  /** Метка «New» (обновление 08.06): связь новая относительно прошлого постера. Снимается при мердже в master. */
  isNew?: boolean;
}
export interface ModuleRef {
  slug: string; title: string; status: ImplStatus; summary: string;
  /** Метка «New» (обновление 08.06): модуль новый относительно прошлого постера. Снимается при мердже в master. */
  isNew?: boolean;
}

export interface CabinetSpec {
  slug: string;
  role: RoleMeta;
  zone: ZoneKey;
  purpose: string;
  coreProcess: ProcessFlow;
  domains: DomainSpec[];
  crossLinks: CrossLink[];
  modules: ModuleRef[];
  sources: SourceCitation[];
  implStatus: ImplStatus;
  isStub?: boolean;
}

export interface ModuleSpec {
  slug: string; cabinetSlug: string; title: string; status: ImplStatus; summary: string;
  purpose?: string; process?: ProcessFlow; domains?: DomainSpec[];
  crossLinks?: CrossLink[]; sources: SourceCitation[]; note?: string;
}
