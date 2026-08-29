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
    <section className="bg-background text-foreground px-7 py-12 transition-colors md:px-11 xl:px-0">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="text-4xl font-bold">{t("title")}</h1>

          <p className="text-muted mt-4 text-sm leading-6">
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
                className="border-border bg-surface text-foreground focus:border-accent focus:ring-accent/20 mt-2 w-full rounded-md border px-4 py-2 outline-none transition focus:ring-2"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? t("submitting") : t("submit")}
            </button>
          </form>

          <p className="text-muted mt-8 text-center text-sm">
            {t("rememberPassword")}{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-hover focus-visible:text-accent font-medium transition"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
