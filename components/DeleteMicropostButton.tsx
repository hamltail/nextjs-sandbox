"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import ConfirmModal from "./ConfirmModal";

type DeleteMicropostButtonProps = {
  id: string;
};

export default function DeleteMicropostButton({
  id,
}: DeleteMicropostButtonProps) {
  const router = useRouter();
  const t = useTranslations("DeleteMicropost");
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
        {t("button")}
      </button>

      <ConfirmModal
        isOpen={isOpen}
        title={t("title")}
        message={t("message")}
        onCancel={() => setIsOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
