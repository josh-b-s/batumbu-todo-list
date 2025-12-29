import type {Meta, StoryObj} from "@storybook/react";
import {fn} from "storybook/test";
import AddActivityButton from "../components/AddActivityButton.tsx";

const meta: Meta<typeof AddActivityButton> = {
    title: "Components/AddActivityButton",
    component: AddActivityButton,
    args: {
        enabled: true,
        onClick: fn(),
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AddActivityButton>;

export const Enabled: Story = {};

export const Disabled: Story = {
    args: {
        enabled: false,
    },
};
