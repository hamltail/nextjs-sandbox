"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function MicropostForm() {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/microposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    });

    if (!response.ok) {
      setError("投稿できませんでした");
      return;
    }

    setContent("");
    setError("");

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
