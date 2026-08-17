"use client";

import { SubmitEvent, useState } from "react";
import Link from "next/link";

export default function PasswordResetsPage() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/password-resets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(
        data.message ?? "パスワード再設定メールの送信に失敗しました。",
      );
      setIsSubmitting(false);
      return;
    }

    setMessage(data.message);
    setIsSubmitting(false);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-en text-3xl font-bold">Forgot password</h1>

      <p className="mt-4 text-sm text-gray-600">
        Enter your email address and we&apos;ll send you a password reset link.
      </p>

      {message && (
        <div className="mt-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

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
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="font-en inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal-500 px-6 text-lg font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-teal-600 hover:underline"
        >
          Log in
        </Link>
      </p>
    </main>
  );
}
