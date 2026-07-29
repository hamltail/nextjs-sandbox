"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      className="font-en transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? "Logging out..." : "Log out"}
    </button>
  );
}
