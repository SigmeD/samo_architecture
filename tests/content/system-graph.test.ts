import { describe, it, expect } from "vitest";
import { CABINETS } from "@/content/cabinets";

/** Граф-консистентность: каждая обоюдная (both) связь A→B должна иметь зеркальную B→A both. */
describe("граф связей кабинетов — двусторонняя согласованность", () => {
  it("для каждой both-связи A→B существует обратная B→A both", () => {
    const errors: string[] = [];
    for (const [slugA, cab] of Object.entries(CABINETS)) {
      for (const l of cab.crossLinks) {
        if (l.stub) continue; // заглушка на роль без кабинета — реципрокность не требуется
        if (l.direction !== "both") continue;
        const B = CABINETS[l.toCabinet];
        if (!B) { errors.push(`${slugA}→${l.toCabinet}: целевой кабинет отсутствует`); continue; }
        const back = B.crossLinks.find((x) => x.toCabinet === slugA);
        if (!back) errors.push(`${slugA}⇄${l.toCabinet}: нет обратной связи в ${l.toCabinet}`);
        else if (back.direction !== "both") errors.push(`${slugA}⇄${l.toCabinet}: обратная ${l.toCabinet}→${slugA}=${back.direction} (не both)`);
      }
    }
    expect(errors, "\n" + errors.join("\n")).toEqual([]);
  });

  it("все toCabinet резолвятся в реестре (кроме заглушек-связей)", () => {
    for (const [slugA, cab] of Object.entries(CABINETS))
      for (const l of cab.crossLinks) {
        if (l.stub) continue; // заглушка на роль без кабинета
        expect(CABINETS[l.toCabinet], `${slugA}→${l.toCabinet}`).toBeDefined();
      }
  });
});
