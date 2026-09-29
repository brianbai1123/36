import originalsJson from "./originals.json";
import { SECTION_META, type OriginalEntry, type SectionName } from "./types";

export const catalog = originalsJson as OriginalEntry[];

export function entryHref(n: number) {
  return `/${n}/`;
}

export function sectionGroups() {
  return SECTION_META.map((meta) => ({
    ...meta,
    entries: catalog.filter((entry) => entry.section === meta.name),
  }));
}

export function sectionOf(n: number): SectionName | "" {
  return SECTION_META.find((meta) => n >= meta.from && n <= meta.to)?.name ?? "";
}
