import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartPanel } from "./chart-panel";

describe("ChartPanel", () => {
  it("labels an empty chart rather than displaying fake data", () => {
    render(<ChartPanel title="Market trend" description="USD history" status="empty" />);
    expect(screen.getByRole("region", { name: "Market trend" })).toHaveAccessibleDescription("USD history");
    expect(screen.getByText("Awaiting market data")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("provides a descriptive text alternative when a real visualization exists", () => {
    render(<ChartPanel title="Performance" description="Monthly chart" status="ready" summary="Value rose from 100 to 120"><svg><path d="M0 0" /></svg></ChartPanel>);
    expect(screen.getByRole("img", { name: "Value rose from 100 to 120" })).toBeInTheDocument();
  });

  it("announces loading and error states", () => {
    const { rerender } = render(<ChartPanel title="Market trend" description="USD history" status="loading" />);
    expect(screen.getByRole("status", { name: "Loading data" })).toBeInTheDocument();
    rerender(<ChartPanel title="Market trend" description="USD history" status="error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
