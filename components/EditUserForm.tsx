"use client";

import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

type EditUserFormProps = {
  id: string;
  name: string;
  email: string;
};

export default function EditUserForm({ id, name, email }: EditUserFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      let message = data.message ?? "ユーザー情報の更新に失敗しました。";

      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const messages = data.errors.map(
          (error: { message: string }) => error.message,
        );

        message = messages.join("\n");
      }

      setErrorMessage(message);
      setIsSubmitting(false);
      return;
    }

    router.push(`/users/${id}?updated=true`);
  }

  return (
    <>
      {errorMessage && (
        <div
          role="alert"
          className="mt-6 whitespace-pre-line rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {errorMessage}
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={name}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-slate-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-teal-400 dark:focus:ring-teal-400/20"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={email}
            disabled
            className="mt-2 w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-gray-400 dark:border-slate-800 dark:bg-slate-900/60 dark:text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="font-en inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal-700 px-6 text-lg font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </>
  );
}
