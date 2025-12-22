import type {Meta, StoryObj} from "@storybook/react";
import {fn} from "storybook/test";
import ConfirmModal from "../components/ConfirmModal.tsx";
import React from "react";

const meta: Meta<typeof ConfirmModal> = {
  title: "Components/ConfirmModal",
  component: ConfirmModal,
  args: {
    open: true,
    title: "Yakin mau lanjut?",
    confirmLabel: "Ya",
    cancelLabel: "Tidak",
    onConfirm: fn(),
    onClose: fn(),
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const Basic: Story = {
  args: {
    children: (
      <p className="text-center text-gray-600 mt-4">
        Aksi ini tidak bisa dibatalkan.
      </p>
    ),
  },
};
