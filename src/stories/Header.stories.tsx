import type {Meta, StoryObj} from "@storybook/react";
import React from "react";
import {MockAccountProvider} from "./MockProviders.tsx";
import Header from "../components/Header.tsx";

const meta: Meta<typeof Header> = {
    title: "Components/Header",
    component: Header,
    decorators: [
        (Story) => (
            <MockAccountProvider>
                <Story/>
            </MockAccountProvider>
        ),
    ],
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};
