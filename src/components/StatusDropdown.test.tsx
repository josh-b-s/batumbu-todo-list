import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import StatusDropdown from "./StatusDropdown";

describe("StatusDropdown", () => {
  it("calls onChange with the newly selected status", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<StatusDropdown value="TODO" onChange={handleChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "DONE" }));

    expect(handleChange).toHaveBeenCalledWith("DONE");
  });

  it("shows the All option when used as a filter dropdown", async () => {
    const user = userEvent.setup();

    render(<StatusDropdown value="All" filter={true} />);

    await user.click(screen.getByRole("combobox"));

    expect(
      await screen.findByRole("option", { name: "All" })
    ).toBeInTheDocument();
  });
});
