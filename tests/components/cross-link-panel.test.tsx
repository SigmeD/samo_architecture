import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CrossLinkPanel } from "@/components/atlas/cross-link-panel";

describe("CrossLinkPanel", () => {
  it("ссылается на целевой кабинет и показывает поток", () => {
    render(
      <ul>
        <CrossLinkPanel link={{ toCabinet: "parent", direction: "both", label: "оплата открывает доступ" }} />
      </ul>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/cabinet/parent");
    expect(screen.getByText("оплата открывает доступ")).toBeInTheDocument();
  });
});
