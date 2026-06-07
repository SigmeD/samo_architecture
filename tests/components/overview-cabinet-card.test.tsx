import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OverviewCabinetCard } from "@/components/atlas/overview-cabinet-card";

const cab = {
  slug: "child", emoji: "🎓", name: "Кабинет ученика", roleCaption: "ребёнок 10–17",
  zone: "green" as const, hero: true, highlights: ["Уроки заранее", "СУ + Бизнес-проект"],
};

describe("OverviewCabinetCard", () => {
  it("рендерит имя, роль и все highlights", () => {
    render(<OverviewCabinetCard cab={cab} />);
    expect(screen.getByText("Кабинет ученика")).toBeInTheDocument();
    expect(screen.getByText("ребёнок 10–17")).toBeInTheDocument();
    expect(screen.getByText("Уроки заранее")).toBeInTheDocument();
    expect(screen.getByText("СУ + Бизнес-проект")).toBeInTheDocument();
  });
  it("ведёт ссылкой на кабинет", () => {
    render(<OverviewCabinetCard cab={cab} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/cabinet/child");
  });
});
