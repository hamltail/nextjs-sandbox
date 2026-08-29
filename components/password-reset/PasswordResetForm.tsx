"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type SubmitEvent, useState } from "react";

type PasswordResetFormProps = {
  email: string;
  token: string;
};

export default function PasswordResetForm({
  email,
  token,
}: PasswordResetFormProps) {
  const router = useRouter();
  const t = useTranslations("PasswordReset");
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
      setErrorMessage(data.message ?? t("error"));
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
            {t("password")}
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="border-border bg-surface text-foreground focus:border-accent focus:ring-accent/20 mt-2 w-full rounded-md border px-4 py-2 outline-none transition focus:ring-2"
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
    </>
  );
}
