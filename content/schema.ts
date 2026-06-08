import { z } from "zod";

export const ImplStatus = z.enum(["done", "partial", "planned", "divergent"]);
export const Direction = z.enum(["in", "out", "both"]);
export const ZoneKey = z.enum(["blue", "green", "orange", "purple", "teal", "gold"]);

const Source = z.object({ id: z.string(), version: z.string(), section: z.string().optional() });
const Step = z.object({
  n: z.number(), title: z.string(), desc: z.string(),
  actors: z.array(z.string()).optional(), source: z.string().optional(), gamification: z.string().optional(),
  isNew: z.boolean().optional(),
});
const Flow = z.object({ title: z.string(), badge: z.string().optional(), steps: z.array(Step).min(1), note: z.string().optional() });
const Domain = z.object({ title: z.string(), items: z.array(z.string()), source: z.string().optional(), readOnly: z.boolean().optional(), toggleable: z.boolean().optional(), isNew: z.boolean().optional() });
const Cross = z.object({ toCabinet: z.string(), label: z.string(), direction: Direction, source: z.string().optional(), isNew: z.boolean().optional() });
const ModuleRef = z.object({ slug: z.string(), title: z.string(), status: ImplStatus, summary: z.string(), isNew: z.boolean().optional() });

export const CabinetSchema = z.object({
  slug: z.string(), role: z.object({ code: z.string(), title: z.string(), emoji: z.string() }),
  zone: ZoneKey, purpose: z.string(), coreProcess: Flow,
  domains: z.array(Domain), crossLinks: z.array(Cross), modules: z.array(ModuleRef),
  sources: z.array(Source), implStatus: ImplStatus, isStub: z.boolean().optional(),
});

export const ModuleSchema = z.object({
  slug: z.string(), cabinetSlug: z.string(), title: z.string(), status: ImplStatus, summary: z.string(),
  purpose: z.string().optional(), process: Flow.optional(), domains: z.array(Domain).optional(),
  crossLinks: z.array(Cross).optional(), sources: z.array(Source), note: z.string().optional(),
});

export function validateCabinet(x: unknown) { return CabinetSchema.parse(x); }
export function validateModule(x: unknown) { return ModuleSchema.parse(x); }

// === L0 overview (poster redesign) ===
const MetaChip = z.object({ label: z.string(), value: z.string().optional(), unverified: z.boolean().optional() });
const OverviewCabinet = z.object({
  slug: z.string(), emoji: z.string(), name: z.string(), roleCaption: z.string(),
  zone: ZoneKey, hero: z.boolean().optional(), highlights: z.array(z.string()).min(1),
});
const FlowStepL0 = z.object({ k: z.string(), v: z.string(), variant: z.enum(["alt", "end"]).optional() });
const FlowBandL0 = z.object({
  emoji: z.string(), title: z.string(), note: z.string().optional(),
  steps: z.array(FlowStepL0).min(1), branch: z.array(FlowStepL0).optional(),
});

export const OverviewSchema = z.object({
  header: z.object({ eyebrow: z.string(), title: z.string(), lead: z.string(), meta: z.array(MetaChip) }),
  core: z.object({ emoji: z.string(), title: z.string(), feats: z.array(z.string()).min(1) }),
  tiers: z.array(z.object({ title: z.string(), cabinets: z.array(OverviewCabinet).min(1) })).min(1),
  processes: z.array(FlowBandL0),
  crossModules: z.array(z.object({ label: z.string(), zone: ZoneKey })),
  dataLayer: z.array(z.object({ label: z.string(), items: z.array(z.string()) })),
  result: z.object({ emoji: z.string(), title: z.string(), sub: z.string() }),
});
export function validateOverview(x: unknown) { return OverviewSchema.parse(x); }
