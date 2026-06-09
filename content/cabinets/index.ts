import type { CabinetSpec } from "@/content/types";
import { curator } from "@/content/cabinets/curator";
import { child } from "@/content/cabinets/child";
import { parent } from "@/content/cabinets/parent";
import { finance } from "@/content/cabinets/finance";
import { franchiseCurator } from "@/content/cabinets/franchise-curator";
import { franchise } from "@/content/cabinets/franchise";
import { schoolAdmin } from "@/content/cabinets/school-admin";
import { seniorCurator } from "@/content/cabinets/senior-curator";
import { lead } from "@/content/cabinets/lead";
import { methodist } from "@/content/cabinets/methodist";
import { sales } from "@/content/cabinets/sales";
import { marketer } from "@/content/cabinets/marketer";
import { guest } from "@/content/cabinets/guest";

export const CABINETS: Record<string, CabinetSpec> = {
  curator,
  child,
  parent,
  "school-admin":   schoolAdmin,
  franchise,
  lead,
  methodist,
  "senior-curator": seniorCurator,
  "franchise-curator": franchiseCurator,
  sales,
  marketer,
  finance,
  guest,
};

export const getCabinet = (slug: string): CabinetSpec | undefined => CABINETS[slug];
export const getAllCabinetSlugs = (): string[] => Object.keys(CABINETS);
