import {render, screen, fireEvent} from "@testing-library/react";
import {describe, it, expect, vi, beforeEach} from "vitest";
import SubActivityDescBox from "../components/SubActivityDescBox";
import React from "react";

/* ---------------- mocks ---------------- */

// mock SimpleMenuBar to avoid tiptap internals
vi.mock("../components/SimpleMenuBar", () => ({
    default: () => <div data-testid="simple-menu-bar" />,
}));

// editor spies (reused across tests)
const setContentMock = vi.fn();
const setEditableMock = vi.fn();
const runMock = vi.fn();

// mock @tiptap/react
vi.mock("@tiptap/react", () => ({
    EditorContent: () => <div data-testid="editor-content" />,
    useEditor: () => ({
        commands: {
            setContent: setContentMock,
        },
        chain: () => ({
            focus: () => ({
                run: runMock,
            }),
        }),
        setEditable: setEditableMock,
        getHTML: () => "<p>edited content</p>",
    }),
}));

// mock contexts
const changeDescriptionMock = vi.fn();

vi.mock("../contexts/SubActivityContext", () => ({
    useSubActivities: () => ({
        activity: {
            id: "sub-1",
            description: "<p>initial description</p>",
        },
    }),
}));

vi.mock("../contexts/ActivityContext", () => ({
    useActivities: () => ({
        changeDescription: changeDescriptionMock,
    }),
}));

/* ---------------- tests ---------------- */

describe("SubActivityDescBox", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders label and Edit button when not disabled", () => {
        render(<SubActivityDescBox />);

        expect(screen.getByText("Deskripsi")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /edit/i})).toBeInTheDocument();
    });

    it("does not render Edit button when disabled prop is true", () => {
        render(<SubActivityDescBox disabled />);

        expect(
            screen.queryByRole("button", {name: /edit/i})
        ).not.toBeInTheDocument();
    });

    it("entering edit mode shows Save and Cancel; Save calls changeDescription", () => {
        render(<SubActivityDescBox />);

        fireEvent.click(screen.getByRole("button", {name: /edit/i}));

        expect(screen.getByRole("button", {name: /save/i})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: /cancel/i})).toBeInTheDocument();
        expect(screen.getByTestId("simple-menu-bar")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", {name: /save/i}));

        expect(changeDescriptionMock).toHaveBeenCalledWith(
            "sub-1",
            "<p>initial description</p>"
        );
    });

    it("cancel resets content via editor.commands.setContent and exits edit mode", () => {
        render(<SubActivityDescBox />);

        fireEvent.click(screen.getByRole("button", {name: /edit/i}));
        fireEvent.click(screen.getByRole("button", {name: /cancel/i}));

        expect(setContentMock).toHaveBeenCalledWith(
            "<p>initial description</p>"
        );

        expect(
            screen.queryByRole("button", {name: /save/i})
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", {name: /cancel/i})
        ).not.toBeInTheDocument();
    });
});
