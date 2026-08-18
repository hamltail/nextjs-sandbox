"use client";

import { useRouter } from "next/navigation";

type DeleteMicropostButtonProps = {
  id: string;
};

export default function DeleteMicropostButton({
  id,
}: DeleteMicropostButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm("このMicropostを削除しますか？");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/microposts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-sm font-semibold text-red-600 transition hover:text-red-700"
    >
      Delete
    </button>
  );
}
