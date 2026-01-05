import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import CommentSection from "../components/CommentSection";

const setActivitiesMock = vi.fn();
const useActivitiesMock = vi.fn();
const useSubActivitiesMock = vi.fn();
const useAccountMock = vi.fn();

vi.mock("../contexts/ActivityContext", () => ({
    useActivities: () => useActivitiesMock(),
}));

vi.mock("../contexts/SubActivityContext", () => ({
    useSubActivities: () => useSubActivitiesMock(),
}));

vi.mock("../contexts/AccountContext", () => ({
    useAccount: () => useAccountMock(),
}));

const mockUser = {name: "testuser", id: "u1"};

const makeComment = (overrides = {}) => ({
    id: "c1",
    user: mockUser,
    date: new Date("2025-12-24T10:54:00Z"),
    comment: "<p>hello world</p>",
    ...overrides,
});

beforeEach(() => {
    vi.resetAllMocks();
    useActivitiesMock.mockReturnValue({
        setActivities: setActivitiesMock,
    });

    useSubActivitiesMock.mockReturnValue({
        activity: {id: "a1", comments: []},
    });

    useAccountMock.mockReturnValue({
        account: mockUser,
        login: vi.fn(),
        logout: vi.fn(),
    });
});

describe("CommentSection (TipTap)", () => {
    it("renders comment count and list when comments present", () => {
        useSubActivitiesMock.mockReturnValue({
            activity: {id: "a1", comments: [makeComment()]},
        });

        render(<CommentSection/>);

        expect(screen.getByText("Komentar (1)")).toBeInTheDocument();
        expect(screen.getByText("hello world")).toBeInTheDocument();
        expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });

    it("adds a comment: calls setActivities updater", async () => {
        render(<CommentSection/>);

        const editor = document.querySelector(
            '[contenteditable="true"]'
        ) as HTMLElement;

        expect(editor).toBeTruthy();

        fireEvent.input(editor, {
            target: {innerHTML: "<p>new comment</p>"},
        });

        const sendButton = screen.getByRole("button", {name: "Kirim"});
        fireEvent.click(sendButton);

        expect(setActivitiesMock).toHaveBeenCalled();

        const updater = setActivitiesMock.mock.calls[0][0];
        expect(typeof updater).toBe("function");

        const prev = [{id: "a1", comments: []}];
        const next = updater(prev);

        const updated = next.find((a: any) => a.id === "a1");
        expect(updated).toBeTruthy();
        expect(updated.comments.length).toBe(1);
        expect(updated.comments[0].comment).toBe("<p>new comment</p>");
        expect(updated.comments[0].user).toEqual(mockUser);
    });

    it("shows validation error when editor is empty", async () => {
        render(<CommentSection/>);

        const sendButton = screen.getByRole("button", {name: "Kirim"});
        fireEvent.click(sendButton);

        expect(
            screen.getByText("Komentar tidak boleh kosong")
        ).toBeInTheDocument();

        expect(setActivitiesMock).not.toHaveBeenCalled();
    });

    it("deletes a comment: calls setActivities updater removing the comment", () => {
        const existing = makeComment({
            id: "c-to-delete",
            comment: "<p>delete me</p>",
        });

        useSubActivitiesMock.mockReturnValue({
            activity: {id: "a1", comments: [existing]},
        });

        render(<CommentSection/>);

        const deleteButton = screen.getByRole("button", {name: "Delete"});
        fireEvent.click(deleteButton);

        expect(setActivitiesMock).toHaveBeenCalled();

        const updater = setActivitiesMock.mock.calls[0][0];
        const prev = [{id: "a1", comments: [existing]}];
        const next = updater(prev);

        const updated = next.find((a: any) => a.id === "a1");
        expect(updated.comments.length).toBe(0);
    });
});
