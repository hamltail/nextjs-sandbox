"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type SubmitEvent, useState } from "react";

import Container from "@/components/Container";

export default function SignupPage() {
  const router = useRouter();
  const t = useTranslations("Signup");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        passwordConfirmation: formData.get("passwordConfirmation"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      let message = data.message ?? t("error");

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

    router.push("/?signup=success");
  }

  return (
    <section className="bg-white px-7 py-12 text-slate-950 transition-colors dark:bg-slate-950 dark:text-gray-100 md:px-11 xl:px-0">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="text-4xl font-bold">{t("title")}</h1>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>

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
                {t("name")}
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-slate-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-teal-400 dark:focus:ring-teal-400/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                {t("email")}
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-slate-950 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-teal-400 dark:focus:ring-teal-400/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                {t("password")}
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
                {t("passwordConfirmation")}
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
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal-700 px-6 text-lg font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
            >
              {isSubmitting ? t("submitting") : t("submit")}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
