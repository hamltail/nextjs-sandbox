"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function SignupSuccessMessage() {
  const t = useTranslations("SignupSuccess");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-6 z-20 flex justify-center px-7 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      <div
        role="status"
        className="pointer-events-auto flex max-w-3xl items-center gap-3 rounded-md border border-teal-300 bg-teal-50/95 px-5 py-3 text-sm text-teal-700 shadow-sm backdrop-blur dark:border-teal-800 dark:bg-teal-950/90 dark:text-teal-200"
      >
        <span aria-hidden="true" className="text-lg font-bold">
          ✓
        </span>

        <p>{t("message")}</p>
      </div>
    </div>
  );
}
