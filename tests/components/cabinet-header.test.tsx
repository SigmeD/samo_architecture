import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CabinetHeader } from "@/components/atlas/cabinet-header";
import { child } from "@/content/cabinets/child";

describe("CabinetHeader", () => {
  it("рендерит роль (h1), статус и крошку «назад к атласу»", () => {
    render(<CabinetHeader cabinet={child} nav={["Главная"]} />);
    expect(screen.getByRole("heading", { level: 1, name: /Ученик ДНМ/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Атлас ДНМ/ })).toHaveAttribute("href", "/");
    expect(screen.getByText("Главная")).toBeInTheDocument();
  });
});
