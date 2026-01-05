import React, {ReactNode} from "react";
import {AccountContext, AccountContextValue} from "../contexts/AccountContext.tsx";
import {ActivityContext, ActivityContextValue} from "../contexts/ActivityContext.tsx";
import {ActivityFilterContext, ActivityFilterContextValue} from "../contexts/ActivityFilterContext.tsx";
import {SubActivityContext, SubActivityContextValue} from "../contexts/SubActivityContext.tsx";
import type {ActivityItem, SubActivityItem} from "../types/activity.ts";

export const mockSubActivities: SubActivityItem[] = [
    {id: "sub-1", title: "Kick-off meeting", priority: "Medium", checked: true},
    {id: "sub-2", title: "Finalize brief", priority: "High", checked: false},
];

export const mockActivity: ActivityItem = {
    id: "activity-1",
    title: "Design Landing Page",
    status: "IN PROGRESS",
    description: "Tingkatkan hero copy dan layout CTA.",
    creator: {role: "engineer", name: "test", pass: ""},
    subActivities: mockSubActivities,
    assignee: {role: "engineer", name: "test", pass: ""},
    creationDate: new Date(),
    dueDate: new Date(),
    comments: []
};

const noop = () => undefined;

export function createAccountContextValue(
    overrides: Partial<AccountContextValue> = {},
): AccountContextValue {
    return {
        account: {role: "engineer", name: "test", pass: ""},
        login: noop,
        logout: noop,
        getEngineerChoices: () => [],
        ...overrides,
    };
}

export function MockAccountProvider({
                                        children,
                                        value = {},
                                    }: {
    children: ReactNode;
    value?: Partial<AccountContextValue>;
}) {
    return (
        <AccountContext.Provider value={createAccountContextValue(value)}>
            {children}
        </AccountContext.Provider>
    );
}

export function createActivityContextValue(
    overrides: Partial<ActivityContextValue> = {},
): ActivityContextValue {
    return {
        activities: [mockActivity],
        setActivities: noop as ActivityContextValue["setActivities"],
        addActivities: noop,
        removeActivities: noop,
        changeTitle: noop,
        changeStatus: noop,
        changeDueDate: noop,
        changeAssignee: noop,
        openDeleteModal: noop,
        closeDeleteModal: noop,
        showDeleteModal: false,
        pendingDeleteId: null,
        changeDescription: noop,
        openAddModal: noop,
        closeAddModal: noop,
        showAddModal: false,
        checkEditAccess: () => true,
        ...overrides,
    };
}

export function MockActivityProvider({
                                         children,
                                         value = {},
                                     }: {
    children: ReactNode;
    value?: Partial<ActivityContextValue>;
}) {
    return (
        <ActivityContext.Provider value={createActivityContextValue(value)}>
            {children}
        </ActivityContext.Provider>
    );
}

export function createActivityFilterContextValue(
    overrides: Partial<ActivityFilterContextValue> = {},
): ActivityFilterContextValue {
    return {
        statusFilter: "All",
        setStatusFilter: noop,
        ...overrides,
    };
}

export function MockActivityFilterProvider({
                                               children,
                                               value = {},
                                           }: {
    children: ReactNode;
    value?: Partial<ActivityFilterContextValue>;
}) {
    return (
        <ActivityFilterContext.Provider value={createActivityFilterContextValue(value)}>
            {children}
        </ActivityFilterContext.Provider>
    );
}

export function createSubActivityContextValue(
    overrides: Partial<SubActivityContextValue> = {},
): SubActivityContextValue {
    return {
        subActivities: mockSubActivities,
        addSubActivity: noop,
        removeSubActivity: noop,
        updateSubTitle: noop,
        changePriority: noop,
        toggleChecked: noop,
        activity: mockActivity,
        showModal: false,
        openDeleteModal: noop,
        closeModal: noop,
        pendingDeleteSubId: null,
        isEditable: true,
        ...overrides,
    };
}

export function MockSubActivityProvider({
                                            children,
                                            value = {},
                                        }: {
    children: ReactNode;
    value?: Partial<SubActivityContextValue>;
}) {
    return (
        <SubActivityContext.Provider value={createSubActivityContextValue(value)}>
            {children}
        </SubActivityContext.Provider>
    );
}