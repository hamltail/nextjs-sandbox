"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="bg-surface text-foreground w-full max-w-md rounded-2xl p-6 shadow-xl"
      >
        <h2 id="confirm-modal-title" className="text-xl font-semibold">
          {title}
        </h2>

        <p className="text-muted mt-3 text-sm leading-8">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="border-border hover:border-primary min-w-24 rounded-full border px-4 py-2 text-sm font-semibold transition"
          >
            {t("cancel")}
          </button>

          <button
            ref={deleteButtonRef}
            type="button"
            onClick={onConfirm}
            className="min-w-24 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
