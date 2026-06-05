import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";

describe("ImplStatusBadge", () => {
  it("divergent → 'расхождение с каноном'", () => {
    render(<ImplStatusBadge status="divergent" />);
    expect(screen.getByText(/расхождение с каноном/i)).toBeInTheDocument();
  });
  it("done → 'реализовано'", () => {
    render(<ImplStatusBadge status="done" />);
    expect(screen.getByText(/реализовано/i)).toBeInTheDocument();
  });
});
