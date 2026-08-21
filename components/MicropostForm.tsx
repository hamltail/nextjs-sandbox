"use client";

import { SubmitEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function MicropostForm() {
  const router = useRouter();

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
      setError("投稿できませんでした");
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
        placeholder="Micropostを入力"
        className="min-h-32 w-full rounded-xl border border-gray-300 p-4"
      />

      <div className="mt-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            setImage(event.target.files?.[0] ?? null);
          }}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{content.length} / 140</p>

        <button
          type="submit"
          className="rounded-full bg-teal-500 px-5 py-2 font-semibold text-white transition hover:bg-teal-600"
        >
          Post
        </button>
      </div>
    </form>
  );
}
