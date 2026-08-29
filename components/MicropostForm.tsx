"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type SubmitEvent, useRef, useState } from "react";

export default function MicropostForm() {
  const router = useRouter();
  const t = useTranslations("MicropostForm");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch("/api/microposts", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();

      setError(data.message ?? t("error"));
      return;
    }

    setContent("");
    setImage(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={140}
        placeholder={t("placeholder")}
        className="border-border text-foreground focus:border-accent focus:ring-accent/20 min-h-32 w-full rounded-xl border bg-white p-4 outline-none transition focus:ring-2 dark:bg-slate-950"
      />

      <div className="mt-4 flex items-center gap-4">
        <input
          id="micropost-image"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            setImage(event.target.files?.[0] ?? null);
          }}
          className="peer sr-only"
        />

        <label
          htmlFor="micropost-image"
          className="text-primary peer-focus-visible:ring-accent inline-flex cursor-pointer items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold transition hover:bg-orange-200 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 dark:bg-orange-950 dark:hover:bg-orange-900"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>

          {t("selectImage")}
        </label>

        <span className="text-muted min-w-0 truncate text-sm">
          {image ? image.name : t("noImageSelected")}
        </span>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted text-sm">{content.length} / 140</p>

        <button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary-hover rounded-full px-5 py-2 font-semibold transition"
        >
          {t("submit")}
        </button>
      </div>
    </form>
  );
}
