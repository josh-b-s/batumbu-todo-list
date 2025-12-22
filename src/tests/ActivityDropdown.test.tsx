import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import ActivityDropdown from "../components/ActivityDropdown.tsx";

describe("ActivityDropdown", () => {
    const choices = [
        { label: "Todo", value: "TODO" },
        { label: "Done", value: "DONE" },
    ];

    it("renders with default value 'All' when filter is true", () => {
        render(<ActivityDropdown choices={choices} filter />);

        expect(screen.getByText("All")).toBeInTheDocument();
    });

    it("renders provided choices", async () => {
        render(<ActivityDropdown choices={choices} filter />);

        fireEvent.mouseDown(screen.getByRole("combobox"));

        expect(await screen.findByText("Todo")).toBeInTheDocument();
        expect(await screen.findByText("Done")).toBeInTheDocument();
    });

    it("calls onChange when a value is selected", async () => {
        const onChange = vi.fn();

        render(
            <ActivityDropdown
                choices={choices}
                filter
                value="TODO"
                onChange={onChange}
            />
        );

        fireEvent.mouseDown(screen.getByRole("combobox"));
        fireEvent.click(await screen.findByText("Done"));

        expect(onChange).toHaveBeenCalledWith("DONE");
    });

    it("shows filter icon when filter is true", () => {
        render(<ActivityDropdown choices={choices} filter />);
        expect(document.querySelector("svg")).toBeTruthy();
    });

    it("disables the dropdown when disabled is true", () => {
        render(
            <ActivityDropdown
                choices={choices}
                filter
                disabled
            />
        );

        const select = screen.getByRole("combobox");
        expect(select).toHaveAttribute("aria-disabled", "true");
    });
});
