import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DomainPanel } from "@/components/atlas/domain-panel";

describe("DomainPanel", () => {
  it("рендерит заголовок, пункты и маркер «только просмотр»", () => {
    render(<DomainPanel accent="green" domain={{ title: "Расписание", items: ["календарь", "уведомления"], readOnly: true }} />);
    expect(screen.getByText("Расписание")).toBeInTheDocument();
    expect(screen.getByText("календарь")).toBeInTheDocument();
    expect(screen.getByText("уведомления")).toBeInTheDocument();
    expect(screen.getByLabelText("только просмотр")).toBeInTheDocument();
  });
});
