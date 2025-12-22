import type { Meta, StoryObj } from '@storybook/react-vite';

import ActivityDropdown from '../components/ActivityDropdown.tsx';

const meta = {
  component: ActivityDropdown,
} satisfies Meta<typeof ActivityDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actions: [{label: "Low", value: "Low"}, {
        label: "Medium",
        value: "Medium"
    }, {label: "High", value: "High"}, {label: "Urgent", value: "Urgent"}],
    value: "label",
    className: "bg-red-500"
  }
};