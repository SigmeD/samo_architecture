import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/atlas/section-header";

describe("SectionHeader", () => {
  it("рендерит номер, заголовок (h2) и caption", () => {
    render(<SectionHeader no="02" title="Роли и кабинеты" caption="11 кабинетов" />);
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Роли и кабинеты" })).toBeInTheDocument();
    expect(screen.getByText("11 кабинетов")).toBeInTheDocument();
  });
});
