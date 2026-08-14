"use client";

import { useRouter } from "next/navigation";

type DeleteUserButtonProps = {
  id: string;
};

export default function DeleteUserButton({
  id,
}: DeleteUserButtonProps) {
  const router = useRouter();

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
    <button
      type="button"
      onClick={handleDelete}
      className="font-en text-sm font-semibold text-red-600 transition hover:text-red-700"
    >
      Delete
    </button>
  );
}
