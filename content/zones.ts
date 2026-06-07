import type { ZoneKey } from "@/content/types";

export interface Zone { key: ZoneKey; label: string; varName: string; }

export const ZONES: Record<ZoneKey, Zone> = {
  blue:   { key: "blue",   label: "Управление/операции", varName: "--color-zone-blue" },
  green:  { key: "green",  label: "Учёба/ученик",        varName: "--color-zone-green" },
  orange: { key: "orange", label: "Школа/админ",          varName: "--color-zone-orange" },
  purple: { key: "purple", label: "Франшиза",             varName: "--color-zone-purple" },
  teal:   { key: "teal",   label: "Продажи/контроль",     varName: "--color-zone-teal" },
  gold:   { key: "gold",   label: "Финансы",              varName: "--color-zone-gold" },
};

export const zoneColor = (z: ZoneKey) => `var(${ZONES[z].varName})`;
