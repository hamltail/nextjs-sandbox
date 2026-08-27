"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import ConfirmModal from "./ConfirmModal";

type DeleteMicropostButtonProps = {
  id: string;
};

export default function DeleteMicropostButton({
  id,
}: DeleteMicropostButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    const response = await fetch(`/api/microposts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }

    setIsOpen(false);

    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
      >
        Delete
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="Micropostを削除しますか？"
        message="削除したMicropostは元に戻せません。"
        onCancel={() => setIsOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
