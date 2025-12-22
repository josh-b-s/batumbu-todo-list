import type {Meta, StoryObj} from "@storybook/react";
import AddActivityModal from "../components/AddActivityModal.tsx";
import {MockActivityProvider} from "./MockProviders.tsx";
import React from "react";

const meta: Meta<typeof AddActivityModal> = {
  title: "Components/AddActivityModal",
  component: AddActivityModal,
  decorators: [
    (Story) => (
      <MockActivityProvider value={{showAddModal: true}}>
        <Story/>
      </MockActivityProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AddActivityModal>;

export const OpenModal: Story = {};
