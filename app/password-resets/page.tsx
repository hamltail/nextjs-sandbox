"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { type SubmitEvent, useState } from "react";

import Container from "@/components/Container";

export default function PasswordResetsPage() {
  const t = useTranslations("PasswordResetRequest");
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
      setErrorMessage(data.message ?? t("error"));
      setIsSubmitting(false);
      return;
    }

    setMessage(data.message);
    setIsSubmitting(false);
  }

  return (
    <section className="bg-white px-7 py-12 text-slate-950 transition-colors dark:bg-slate-950 dark:text-gray-100 md:px-11 xl:px-0">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="text-4xl font-bold">{t("title")}</h1>

          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>

          {message && (
            <div
              role="status"
              className="mt-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
            >
              {message}
            </div>
          )}

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
              <label htmlFor="email" className="block text-sm font-medium">
                {t("email")}
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-slate-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-teal-400 dark:focus:ring-teal-400/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal-700 px-6 text-lg font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
            >
              {isSubmitting ? t("submitting") : t("submit")}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
            {t("rememberPassword")}{" "}
            <Link
              href="/login"
              className="font-medium text-teal-700 transition hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
