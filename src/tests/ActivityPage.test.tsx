import {render, screen} from "@testing-library/react";
import React from "react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import ActivityPage from "../pages/ActivityPage.tsx";

const mockNavigate = vi.fn();
const useAccountMock = vi.fn();
const useActivitiesMock = vi.fn();
const useActivityFilterMock = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>(
        "react-router-dom"
    );
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../contexts/AccountContext.tsx", () => ({
    useAccount: () => useAccountMock(),
}));

vi.mock("../contexts/ActivityContext.tsx", () => ({
    useActivities: () => useActivitiesMock(),
}));

vi.mock("../contexts/ActivityFilterContext.tsx", () => ({
    useActivityFilter: () => useActivityFilterMock(),
}));

vi.mock("../components/Header", () => ({
    default: () => <div data-testid="header">Header</div>,
}));

vi.mock("../components/NoActivities", () => ({
    default: () => <div data-testid="empty-state">Belum ada Aktivitas</div>,
}));

vi.mock("../components/AddActivityButton.tsx", () => ({
    default: (props: React.ComponentProps<"button">) => (
        <button type="button" data-testid="desktop-add" {...props}>
            Add Activity
        </button>
    ),
}));

vi.mock("../components/AddActivityButtonMobile.tsx", () => ({
    default: (props: React.ComponentProps<"button">) => (
        <button type="button" data-testid="mobile-add" {...props}>
            Add Activity Mobile
        </button>
    ),
}));

vi.mock("../components/AddActivityModal.tsx", () => ({
    default: () => <div data-testid="add-modal"/>,
}));

vi.mock("../components/ConfirmModal", () => ({
    default: ({title}: { title: string }) => (
        <div data-testid="confirm-modal">{title}</div>
    ),
}));

vi.mock("../components/StatusDropdown.tsx", () => ({
    default: ({value}: { value: string }) => (
        <div data-testid="status-dropdown">{value}</div>
    ),
}));

const defaultActivityContextValue = () => ({
    activities: [],
    setActivities: vi.fn(),
    addActivities: vi.fn(),
    removeActivities: vi.fn(),
    changeTitle: vi.fn(),
    changeStatus: vi.fn(),
    openDeleteModal: vi.fn(),
    closeDeleteModal: vi.fn(),
    showDeleteModal: false,
    pendingDeleteId: null,
    changeDescription: vi.fn(),
    isEditableByClient: true,
    openAddModal: vi.fn(),
    closeAddModal: vi.fn(),
    showAddModal: false,
});

function createActivityContextValue(
    overrides: Partial<ReturnType<typeof defaultActivityContextValue>> = {}
) {
    return {
        ...defaultActivityContextValue(),
        ...overrides,
    };
}

describe("ActivityPage", () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        useAccountMock.mockReturnValue({
            account: "test1@gmail.com",
            login: vi.fn(),
            logout: vi.fn(),
        });
        useActivityFilterMock.mockReturnValue({
            statusFilter: "All",
            setStatusFilter: vi.fn(),
        });
        useActivitiesMock.mockReturnValue(defaultActivityContextValue());
    });

    it("shows empty state when no activities match the filter", () => {
        render(<ActivityPage/>);

        expect(screen.getByTestId("empty-state")).toBeInTheDocument();
        expect(screen.queryByTestId("activity-list")).not.toBeInTheDocument();
    });

    it("only passes activities that match the status filter to ActivityList", () => {
        useActivitiesMock.mockReturnValue(
            createActivityContextValue({
                activities: [
                    {id: "1", title: "Todo item", status: "TODO"},
                    {id: "2", title: "Done item", status: "DONE"},
                ] as never[],
            })
        );
        useActivityFilterMock.mockReturnValue({
            statusFilter: "DONE",
            setStatusFilter: vi.fn(),
        });

        render(<ActivityPage/>);
    });
});
