"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    const response = await fetch("/api/session", {
      method: "DELETE",
    });

    if (!response.ok) {
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="font-en hover:text-accent focus-visible:text-accent inline-flex items-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="size-4"
      >
        <path
          d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 12H9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {isSubmitting ? "Logging out..." : "Log out"}
    </button>
  );
}
