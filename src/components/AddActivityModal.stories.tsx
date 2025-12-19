import type {Meta, StoryObj} from "@storybook/react";
import AddActivityModal from "./AddActivityModal";
import {MockActivityProvider} from "../stories/MockProviders";

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
