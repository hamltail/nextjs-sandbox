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
        className="min-h-32 w-full rounded-xl border border-gray-300 bg-white p-4 text-slate-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/20"
      />

      <div className="mt-4">
        <label htmlFor="micropost-image" className="sr-only">
          {t("image")}
        </label>

        <input
          id="micropost-image"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            setImage(event.target.files?.[0] ?? null);
          }}
          className="text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700 hover:file:bg-gray-200 dark:text-gray-300 dark:file:bg-slate-800 dark:file:text-gray-200 dark:hover:file:bg-slate-700"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {content.length} / 140
        </p>

        <button
          type="submit"
          className="rounded-full bg-teal-700 px-5 py-2 font-semibold text-white transition hover:bg-teal-800 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
        >
          {t("submit")}
        </button>
      </div>
    </form>
  );
}
