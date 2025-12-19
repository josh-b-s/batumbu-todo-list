import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import PriorityDropdown from "./PriorityDropdown";

const meta: Meta<typeof PriorityDropdown> = {
  title: "Components/PriorityDropdown",
  component: PriorityDropdown,
  args: {
    value: "Medium",
    onChange: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PriorityDropdown>;

export const Medium: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
