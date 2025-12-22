import type {Meta, StoryObj} from "@storybook/react";
import {fn} from "@storybook/test";
import StatusDropdown from "./StatusDropdown";

const meta: Meta<typeof StatusDropdown> = {
  title: "Components/StatusDropdown",
  component: StatusDropdown,
  args: {
    value: "TODO",
    onChange: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusDropdown>;

export const Default: Story = {};

export const AsFilterDropdown: Story = {
  args: {
    value: "All",
    filter: true,
  },
};
