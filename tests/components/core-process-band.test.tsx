import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CoreProcessBand } from "@/components/atlas/core-process-band";

describe("CoreProcessBand", () => {
  it("рендерит заголовок, badge и все шаги", () => {
    render(
      <CoreProcessBand
        zone="green"
        flow={{
          title: "Учебный цикл",
          badge: "верифицировано",
          steps: [
            { n: 1, title: "Видео", desc: "материал" },
            { n: 2, title: "Сертификат", desc: "итог" },
          ],
        }}
      />,
    );
    expect(screen.getByText("Учебный цикл")).toBeInTheDocument();
    expect(screen.getByText("верифицировано")).toBeInTheDocument();
    expect(screen.getByText(/Видео/)).toBeInTheDocument();
    expect(screen.getByText(/Сертификат/)).toBeInTheDocument();
  });
});
