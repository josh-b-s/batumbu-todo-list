import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import React from "react";
import { MockAccountProvider } from "../stories/MockProviders";
import AccountDropdown from "./AccountDropdown";

const meta: Meta<typeof AccountDropdown> = {
  title: "Components/AccountDropdown",
  component: AccountDropdown,
  args: {
    className: "opacity-80",
    setShowModal: fn(),
  },
  decorators: [
    (Story) => (
      <MockAccountProvider>
        <div className="bg-batumbured p-4">
          <Story />
        </div>
      </MockAccountProvider>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AccountDropdown>;

export const Default: Story = {};
