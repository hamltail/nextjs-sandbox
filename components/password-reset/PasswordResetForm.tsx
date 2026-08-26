"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PasswordResetFormProps = {
  email: string;
  token: string;
};

export default function PasswordResetForm({
  email,
  token,
}: PasswordResetFormProps) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/password-resets/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: formData.get("password"),
        passwordConfirmation: formData.get("passwordConfirmation"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.message ?? "パスワードの更新に失敗しました。");
      setIsSubmitting(false);
      return;
    }

    router.push("/login");
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
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-slate-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-teal-400 dark:focus:ring-teal-400/20"
          />
        </div>

        <div>
          <label
            htmlFor="passwordConfirmation"
            className="block text-sm font-medium"
          >
            Confirm password
          </label>

          <input
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-slate-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-teal-400 dark:focus:ring-teal-400/20"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="font-en inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal-500 px-6 text-lg font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </>
  );
}
