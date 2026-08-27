import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ConfirmModal from "./ConfirmModal";

const meta = {
  title: "Components/ConfirmModal",
  component: ConfirmModal,
} satisfies Meta<typeof ConfirmModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: "Micropostを削除しますか？",
    message: "削除したMicropostは元に戻せません。",
    onCancel: () => {},
    onConfirm: () => {},
  },
};
