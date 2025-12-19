import type {Meta, StoryObj} from "@storybook/react";
import {fn} from "@storybook/test";
import AddActivityButtonMobile from "./AddActivityButtonMobile";

const meta: Meta<typeof AddActivityButtonMobile> = {
  title: "Components/AddActivityButtonMobile",
  component: AddActivityButtonMobile,
  args: {
    enabled: true,
    onClick: fn(),
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AddActivityButtonMobile>;

export const Enabled: Story = {};

export const Disabled: Story = {
  args: {
    enabled: false,
  },
};
