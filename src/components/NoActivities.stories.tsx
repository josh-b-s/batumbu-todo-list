import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MockActivityFilterProvider } from "../stories/MockProviders";
import NoActivities from "./NoActivities";

const meta: Meta<typeof NoActivities> = {
  title: "Components/NoActivities",
  component: NoActivities,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NoActivities>;

export const EmptyAll: Story = {
  render: () => (
    <MockActivityFilterProvider value={{ statusFilter: "All" }}>
      <NoActivities />
    </MockActivityFilterProvider>
  ),
};

export const EmptyDoneOnly: Story = {
  render: () => (
    <MockActivityFilterProvider value={{ statusFilter: "DONE" }}>
      <NoActivities />
    </MockActivityFilterProvider>
  ),
};
