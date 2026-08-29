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
        className="border-border text-foreground focus:border-primary focus:ring-primary/20 min-h-32 w-full rounded-xl border bg-white p-4 outline-none transition focus:ring-2 dark:bg-slate-950"
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
          className="text-muted file:bg-primary file:text-primary-foreground hover:file:bg-primary-hover text-sm file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:px-4 file:py-2 file:font-semibold file:transition"
        />
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
