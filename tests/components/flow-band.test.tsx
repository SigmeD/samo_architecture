import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FlowBand } from "@/components/atlas/flow-band";

describe("FlowBand", () => {
  it("рендерит заголовок и все шаги (вкл. branch)", () => {
    render(
      <FlowBand
        band={{
          emoji: "💼", title: "Воронка",
          steps: [{ k: "Маркетинг", v: "лид" }],
          branch: [{ k: "Пролонгация", v: "новый период", variant: "end" }],
        }}
      />
    );
    expect(screen.getByText("Воронка")).toBeInTheDocument();
    expect(screen.getByText("Маркетинг")).toBeInTheDocument();
    expect(screen.getByText("Пролонгация")).toBeInTheDocument();
  });
});
