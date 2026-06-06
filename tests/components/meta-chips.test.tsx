import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetaChips } from "@/components/atlas/meta-chips";

describe("MetaChips", () => {
  it("рендерит значение и подпись", () => {
    render(<MetaChips items={[{ label: "кабинетов", value: "11" }]} />);
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("кабинетов")).toBeInTheDocument();
  });
  it("unverified → метка «на подтверждении»", () => {
    render(<MetaChips items={[{ label: "модулей", value: "73", unverified: true }]} />);
    expect(screen.getByText(/на подтверждении/i)).toBeInTheDocument();
  });
});
