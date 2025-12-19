import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import React from "react";
import {
  MockActivityProvider,
  MockSubActivityProvider,
  mockActivity,
} from "../stories/MockProviders";
import SubActivityDescBox from "./SubActivityDescBox";

const meta: Meta<typeof SubActivityDescBox> = {
  title: "Components/SubActivityDescBox",
  component: SubActivityDescBox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SubActivityDescBox>;

export const Editable: Story = {
  render: () => (
    <MockActivityProvider
      value={{
        activities: [mockActivity],
        changeDescription: fn(),
      }}
    >
      <MockSubActivityProvider
        value={{
          activity: mockActivity,
          isEditable: true,
          isEditableByClient: true,
        }}
      >
        <SubActivityDescBox activityId={mockActivity.id} />
      </MockSubActivityProvider>
    </MockActivityProvider>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <MockActivityProvider
      value={{
        activities: [{ ...mockActivity, status: "DONE" }],
        changeDescription: fn(),
      }}
    >
      <MockSubActivityProvider
        value={{
          activity: { ...mockActivity, status: "DONE" },
          isEditable: false,
          isEditableByClient: false,
        }}
      >
        <SubActivityDescBox activityId={mockActivity.id} />
      </MockSubActivityProvider>
    </MockActivityProvider>
  ),
};
