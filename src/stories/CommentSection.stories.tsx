import React, {ReactNode, useState} from "react";
import type {Meta, StoryObj} from "@storybook/react";
import CommentSection from "../components/CommentSection";
import {AccountContext} from "../contexts/AccountContext";
import {ActivityContext} from "../contexts/ActivityContext";
import {SubActivityContext} from "../contexts/SubActivityContext";
import type {ActivityItem} from "../types/activity";
import type {User, UserComment} from "../types/account";

const meta: Meta<typeof CommentSection> = {
    title: "Components/CommentSection",
    component: CommentSection,
};
export default meta;
type Story = StoryObj<typeof CommentSection>;

function MockProviders({
                           children,
                           initialActivities,
                           selectedActivityId,
                           currentAccount,
                       }: {
    children: ReactNode;
    initialActivities: ActivityItem[];
    selectedActivityId: string;
    currentAccount: User | null;
}) {
    const [activities, setActivities] =
        useState<ActivityItem[]>(initialActivities);

    const accountCtx = {
        account: currentAccount,
        login: () => undefined,
        logout: () => undefined,
    };

    const activityCtx = {
        activities,
        setActivities,
        openDeleteModal: () => undefined,
        showDeleteModal: false,
        pendingDeleteId: null,
        changeDescription: () => undefined,
        isEditableByClient: true,
        showAddModal: false,
    };

    const subActivity =
        activities.find(a => a.id === selectedActivityId) ?? null;

    const subActivityCtx = {
        activity: subActivity,
        subActivities: subActivity?.subActivities ?? [],
        addSubActivity: () => undefined,
        openDeleteModal: () => undefined,
        closeModal: () => undefined,
    };

    return (
        <AccountContext.Provider value={accountCtx as any}>
            <ActivityContext.Provider value={activityCtx as any}>
                <SubActivityContext.Provider value={subActivityCtx as any}>
                    {children}
                </SubActivityContext.Provider>
            </ActivityContext.Provider>
        </AccountContext.Provider>
    );
}

const demoUser: User = {
    name: "Test User",
    role: "engineer",
    pass: "",
};

const demoComment: UserComment = {
    id: "c-1",
    user: demoUser,
    date: new Date("2025-12-24T17:54:00"),
    comment: "<p>This is a demo comment</p>",
};

const demoActivity: ActivityItem = {
    id: "act-1",
    title: "Demo activity",
    status: "TODO",
    subActivities: [],
    description: "",
    creator: demoUser,
    assignee: null,
    creationDate: new Date(),
    dueDate: null,
    comments: [demoComment],
};

export const Default: Story = {
    render: () => (
        <MockProviders
            initialActivities={[demoActivity]}
            selectedActivityId={demoActivity.id}
            currentAccount={demoUser}
        >
            <div style={{maxWidth: 640, padding: 24}}>
                <CommentSection/>
            </div>
        </MockProviders>
    ),
};

export const EmptyComments: Story = {
    render: () => (
        <MockProviders
            initialActivities={[
                {...demoActivity, id: "act-2", comments: []},
            ]}
            selectedActivityId="act-2"
            currentAccount={demoUser}
        >
            <div style={{maxWidth: 640, padding: 24}}>
                <CommentSection/>
            </div>
        </MockProviders>
    ),
};

export const MultipleComments: Story = {
    render: () => {
        const comments: UserComment[] = [
            demoComment,
            {
                id: "c-2",
                user: demoUser,
                date: new Date(),
                comment: "<p>Second comment</p>",
            },
            {
                id: "c-3",
                user: {name: "Other", role: "engineer", pass: ""},
                date: new Date(),
                comment: "<p>Third comment</p>",
            },
        ];

        const activity: ActivityItem = {
            ...demoActivity,
            id: "act-3",
            comments,
        };

        return (
            <MockProviders
                initialActivities={[activity]}
                selectedActivityId={activity.id}
                currentAccount={demoUser}
            >
                <div style={{maxWidth: 640, padding: 24}}>
                    <CommentSection/>
                </div>
            </MockProviders>
        );
    },
};
