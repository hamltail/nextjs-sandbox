"use client";

import { useState } from "react";

export default function UseStateCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="border-border bg-surface/90 rounded-2xl border p-6 shadow-sm">
      <p className="font-en text-primary text-sm font-semibold tracking-[0.18em]">
        useState
      </p>

      <p className="mt-6 text-center text-5xl font-bold">{count}</p>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setCount((current) => current - 1)}
          className="border-border hover:border-primary min-w-12 rounded-full border px-4 py-2 font-semibold transition"
        >
          −
        </button>

        <button
          type="button"
          onClick={() => setCount(0)}
          className="border-border hover:border-primary rounded-full border px-4 py-2 text-sm font-semibold transition"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={() => setCount((current) => current + 1)}
          className="border-border hover:border-primary min-w-12 rounded-full border px-4 py-2 font-semibold transition"
        >
          ＋
        </button>
      </div>
    </div>
  );
}
