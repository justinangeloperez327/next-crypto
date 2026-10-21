import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable, type DataColumn } from "./data-table";

type Item = { id: string; name: string; score: number };
const rows: Item[] = [
  { id: "c", name: "Cardano", score: 2 },
  { id: "a", name: "Bitcoin", score: 9 },
  { id: "b", name: "Ethereum", score: 5 },
];
const columns: DataColumn<Item>[] = [
  { id: "name", label: "Asset", cell: (row) => row.name, sortValue: (row) => row.name },
  { id: "score", label: "Score", cell: (row) => row.score, sortValue: (row) => row.score },
];

function table(pageSize = 10) {
  return (
    <DataTable
      label="Demo assets"
      rows={rows}
      columns={columns}
      rowKey={(row) => row.id}
      searchValue={(row) => row.name}
      pageSize={pageSize}
    />
  );
}

describe("DataTable", () => {
  it("filters assets and displays an accessible empty state", async () => {
    const user = userEvent.setup();
    render(table());
    await user.type(screen.getByRole("searchbox", { name: "Search Demo assets" }), "eth");
    expect(screen.getByRole("table", { name: "Demo assets" })).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "not-a-coin");
    expect(screen.getByText("No matching results")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("sorts by the requested column and exposes aria-sort", async () => {
    const user = userEvent.setup();
    render(table());
    await user.click(screen.getByRole("button", { name: "Sort by Score" }));
    const assetCells = () => within(screen.getByRole("table")).getAllByRole("row").slice(1).map((row) => within(row).getAllByRole("cell")[0].textContent);
    expect(assetCells()).toEqual(["Cardano", "Ethereum", "Bitcoin"]);
    expect(screen.getByRole("columnheader", { name: "Score" })).toHaveAttribute("aria-sort", "ascending");
    await user.click(screen.getByRole("button", { name: "Sort by Score" }));
    expect(assetCells()).toEqual(["Bitcoin", "Ethereum", "Cardano"]);
    expect(screen.getByRole("columnheader", { name: "Score" })).toHaveAttribute("aria-sort", "descending");
  });

  it("supports keyboard-accessible pagination", async () => {
    const user = userEvent.setup();
    render(table(2));
    expect(screen.getByText("Showing 1–2 of 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Showing 3–3 of 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    await user.keyboard("{Tab}");
  });

  it("shows loading and recovery states without rendering stale rows", async () => {
    const retry = vi.fn();
    const { rerender } = render(<DataTable label="Demo" rows={rows} columns={columns} rowKey={(row) => row.id} status="loading" />);
    expect(screen.getByRole("status", { name: "Loading data" })).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    rerender(<DataTable label="Demo" rows={rows} columns={columns} rowKey={(row) => row.id} status="error" onRetry={retry} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
