import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

const { setTheme } = vi.hoisted(() => ({ setTheme: vi.fn() }));
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme }),
}));

describe("ThemeToggle", () => {
  it("allows switching away from the resolved dark theme", async () => {
    render(<ThemeToggle />);
    await userEvent.setup().click(await screen.findByRole("button", { name: "Switch to light mode" }));
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
