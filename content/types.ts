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

// === Сводная карта системы (L0 /map): иерархия + матрица RBAC + карта передач ===

/** Уровень доступа в матрице «роль × раздел × право». ● полный · ◐ частичный · 👁 просмотр · ⚙ feature-toggle · — нет. */
export type AccessLevel = "full" | "partial" | "view" | "toggle" | "none";
/** Ячейка матрицы: уровень + опц. флаг расхождения с текущим каноном (новое намерение ≠ RBAC v1.4). */
export interface MatrixCell { level: AccessLevel; divergent?: boolean; note?: string }
export interface MatrixRow {
  role: string; slug?: string;
  /** Роль спроектирована, но в RBAC v1.4 не внесена (напр. маркетолог). */
  offCanon?: boolean;
  /** Ровно `AccessMatrix.sections.length` ячеек: строка-код уровня или объект с флагом. */
  cells: (AccessLevel | MatrixCell)[];
}
export interface AccessMatrix { sections: string[]; rows: MatrixRow[] }

export interface HierarchyRole { title: string; caption: string; slug?: string; dashed?: boolean; tag?: string }
export interface HierarchyTier { label: string; zone: ZoneKey; roles: HierarchyRole[]; connector?: "down" }

export interface HandoffNode { label: string; zone: ZoneKey }
export interface HandoffFlow { from: HandoffNode; what: string; to: HandoffNode; also?: HandoffNode; suffix?: string }
export interface HandoffColumn { title: string; emoji: string; flows: HandoffFlow[] }

export interface SystemMap {
  hierarchy: HierarchyTier[];
  hierarchyNote: string;
  matrix: AccessMatrix;
  matrixNote: string;
  /** Вскрытые нестыковки «намерение ↔ канон» — сводка под матрицей. */
  divergences: { title: string; detail: string }[];
  handoffs: HandoffColumn[];
  sources: SourceCitation[];
}
