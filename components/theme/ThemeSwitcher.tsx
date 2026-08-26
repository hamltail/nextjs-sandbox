"use client";

import { useTheme } from "./ThemeProvider";

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="テーマ切り替え"
      className="flex items-center rounded-full border border-gray-300 p-1 dark:border-slate-700"
    >
      {themes.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => setTheme(item.value)}
          className="rounded-full px-3 py-1 text-sm transition hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
