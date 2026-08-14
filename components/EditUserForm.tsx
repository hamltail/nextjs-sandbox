"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";

type EditUserFormProps = {
  id: string;
  name: string;
  email: string;
};

export default function EditUserForm({
  id,
  name,
  email,
}: EditUserFormProps) {
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
        email: formData.get("email"),
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

    router.push(`/users/${id}`);
  }

  return (
    <>
      {errorMessage && (
        <div
          role="alert"
          className="mt-6 whitespace-pre-line rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
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
            className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
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
            className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="font-en inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal-500 px-6 text-lg font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </>
  );
}
