import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProcessFlow } from "@/components/atlas/process-flow";
import { curator } from "@/content/cabinets/curator";

it("рендерит 3 фазы куратора и badge 'на подтверждении'", () => {
  render(<ProcessFlow flow={curator.coreProcess} />);
  expect(screen.getByText(/Приветствие/)).toBeInTheDocument();
  expect(screen.getByText(/Завершение/)).toBeInTheDocument();
  expect(screen.getByText(/на подтверждении/)).toBeInTheDocument();
});
