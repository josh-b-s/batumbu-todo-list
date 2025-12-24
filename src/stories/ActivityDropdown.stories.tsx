import type {Meta, StoryObj} from '@storybook/react-vite';

import ActivityDropdown from '../components/ActivityDropdown.tsx';
import React, {useState} from "react";

const meta = {
    component: ActivityDropdown,
} satisfies Meta<typeof ActivityDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        choices: [{label: "Low", value: "Low"}, {
            label: "Medium",
            value: "Medium"
        }, {label: "High", value: "High"}, {label: "Urgent", value: "Urgent"}],
        className: "bg-red-500"
    },
    render: (args) => {
        const [value, setValue] = useState("Low")
        return <ActivityDropdown {...args} onChange={setValue} value={value}/>
    }
};