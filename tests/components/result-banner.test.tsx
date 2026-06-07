import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultBanner } from "@/components/atlas/result-banner";

it("ResultBanner рендерит заголовок и подпись", () => {
  render(<ResultBanner banner={{ emoji: "🏆", title: "Итог", sub: "путь" }} />);
  expect(screen.getByText("Итог")).toBeInTheDocument();
  expect(screen.getByText("путь")).toBeInTheDocument();
});
