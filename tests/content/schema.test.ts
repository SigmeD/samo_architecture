import { describe, it, expect } from "vitest";
import { CabinetSchema, validateCabinet } from "@/content/schema";

const valid = {
  slug: "x", role: { code: "r", title: "R", emoji: "🧑" }, zone: "blue",
  purpose: "p", coreProcess: { title: "c", steps: [{ n: 1, title: "s", desc: "d" }] },
  domains: [{ title: "d", items: ["a"] }],
  crossLinks: [{ toCabinet: "y", label: "l", direction: "both" }],
  modules: [{ slug: "m", title: "M", status: "done", summary: "s" }],
  sources: [{ id: "SPEC-1", version: "1.0" }], implStatus: "partial",
};

describe("CabinetSchema", () => {
  it("accepts a valid cabinet", () => { expect(() => validateCabinet(valid)).not.toThrow(); });
  it("rejects an unknown implStatus", () => { expect(() => validateCabinet({ ...valid, implStatus: "??" })).toThrow(); });
  it("rejects an unknown zone", () => { expect(() => validateCabinet({ ...valid, zone: "rainbow" })).toThrow(); });

  // === метка «New» (обновление 08.06): опц. isNew на блоках; снимается при мердже в master ===
  it("accepts isNew on domain / step / crossLink / module", () => {
    const withNew = {
      ...valid,
      coreProcess: { title: "c", steps: [{ n: 1, title: "s", desc: "d", isNew: true }] },
      domains: [{ title: "d", items: ["a"], isNew: true }],
      crossLinks: [{ toCabinet: "y", label: "l", direction: "both", isNew: true }],
      modules: [{ slug: "m", title: "M", status: "planned", summary: "s", isNew: true }],
    };
    expect(() => validateCabinet(withNew)).not.toThrow();
  });
  it("isNew is optional — omitting it still validates", () => {
    expect(validateCabinet(valid).domains[0]).not.toHaveProperty("isNew");
  });
  it("rejects a non-boolean isNew", () => {
    expect(() => validateCabinet({ ...valid, domains: [{ title: "d", items: ["a"], isNew: "yes" }] })).toThrow();
  });
});
