import React, {ReactNode, useState} from "react";
import type {Meta, StoryObj} from "@storybook/react";
import SubActivityDescBox from "../components/SubActivityDescBox";
import {ActivityContext} from "../contexts/ActivityContext";
import {SubActivityContext} from "../contexts/SubActivityContext";
import {secondaryBgColor} from "../consts";

const meta: Meta<typeof SubActivityDescBox> = {
    title: "Components/SubActivityDescBox",
    component: SubActivityDescBox,
};
export default meta;

type Story = StoryObj<typeof SubActivityDescBox>;


type MockActivity = {
    id: string;
    description: string;
};

function MockProviders({
                           children,
                           initialDescription,
                       }: {
    children: ReactNode;
    initialDescription: string;
}) {
    const [activity, setActivity] = useState<MockActivity>({
        id: "sub-1",
        description: initialDescription,
    });

    return (
        <ActivityContext.Provider
            value={{
                changeDescription: (id: string, desc: string) => {
                    if (id === activity.id) {
                        setActivity((prev) => ({...prev, description: desc}));
                    }
                },
            } as any}
        >
            <SubActivityContext.Provider
                value={{
                    activity,
                } as any}
            >
                <div className={`${secondaryBgColor} p-4 rounded-2xl max-w-xl`}>
                    {children}
                </div>
            </SubActivityContext.Provider>
        </ActivityContext.Provider>
    );
}


export const Default: Story = {
    render: () => (
        <MockProviders initialDescription="<p>This is a description.</p>">
            <SubActivityDescBox/>
        </MockProviders>
    ),
};

export const Editing: Story = {
    render: () => (
        <MockProviders initialDescription="<p>Edit me ✏️</p>">
            <SubActivityDescBox/>
        </MockProviders>
    ),
};

export const Disabled: Story = {
    render: () => (
        <MockProviders initialDescription="<p>Read-only description</p>">
            <SubActivityDescBox disabled/>
        </MockProviders>
    ),
};

export const EmptyDescription: Story = {
    render: () => (
        <MockProviders initialDescription="<p></p>">
            <SubActivityDescBox/>
        </MockProviders>
    ),
};
