"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const t = useTranslations("ConfirmModal");
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      if (event.shiftKey) {
        if (document.activeElement === cancelButtonRef.current) {
          event.preventDefault();
          deleteButtonRef.current?.focus();
        }

        return;
      }

      if (document.activeElement === deleteButtonRef.current) {
        event.preventDefault();
        cancelButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
      >
        <h2 id="confirm-modal-title" className="text-xl font-semibold">
          {title}
        </h2>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-600"
          >
            {t("cancel")}
          </button>

          <button
            ref={deleteButtonRef}
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
