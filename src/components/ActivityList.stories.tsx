import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ActivityList from "./ActivityList";

type DemoActivity = {
  id: string;
  title: string;
  owner: string;
};

const sampleActivities: DemoActivity[] = [
  { id: "1", title: "Review backlog items", owner: "Sari" },
  { id: "2", title: "Sync with QA team", owner: "Wira" },
  { id: "3", title: "Refine sprint goals", owner: "Danu" },
];

function DemoCard({ activity }: { activity: DemoActivity }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-2">
      <p className="font-semibold">{activity.title}</p>
      <p className="text-sm text-gray-500">Owner: {activity.owner}</p>
    </div>
  );
}

const meta: Meta<typeof ActivityList> = {
  title: "Components/ActivityList",
  component: ActivityList,
  tags: ["autodocs"],
  parameters: {
    controls: { exclude: ["activities", "ActivityElement"] },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityList>;

export const Default: Story = {
  render: () => (
    <ActivityList activities={sampleActivities} ActivityElement={DemoCard} />
  ),
};
