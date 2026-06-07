import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SourceRef } from "@/components/atlas/source-ref";

it("рендерит ID + версию + раздел", () => {
  render(<SourceRef sources={[{ id: "SPEC-DNM-TZ-001", version: "3.2", section: "4.4" }]} />);
  expect(screen.getByText("SPEC-DNM-TZ-001 v3.2 §4.4")).toBeInTheDocument();
});
