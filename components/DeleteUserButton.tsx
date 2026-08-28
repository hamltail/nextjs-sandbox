"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ConfirmModal from "./ConfirmModal";

type DeleteUserButtonProps = {
  id: string;
};

export default function DeleteUserButton({ id }: DeleteUserButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }

    router.push("/users?deleted=true");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="font-en text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
      >
        Delete
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title="ユーザーを削除しますか？"
        message="削除したユーザーは元に戻せません。"
        onCancel={() => setIsOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
