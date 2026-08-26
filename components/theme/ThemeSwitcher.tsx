"use client";

import { useState } from "react";

import { useTheme } from "./ThemeProvider";

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

type ThemeSwitcherProps = {
  variant?: "dropdown" | "list";
};

export default function ThemeSwitcher({
  variant = "dropdown",
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  function selectTheme(value: (typeof themes)[number]["value"]) {
    setTheme(value);
    setIsOpen(false);
  }

  if (variant === "list") {
    return (
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
          Theme
        </p>

        <div
          role="group"
          aria-label="テーマ切り替え"
          className="flex flex-col gap-2"
        >
          {themes.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => selectTheme(item.value)}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-left transition ${
                theme === item.value
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{item.label}</span>

              {theme === item.value && (
                <span aria-hidden="true" className="font-bold">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="theme-menu"
        onClick={() => setIsOpen((current) => !current)}
        className="font-en rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold transition hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        Theme
      </button>

      <div
        id="theme-menu"
        className={`absolute right-0 top-full z-50 mt-2 w-36 rounded-xl border border-gray-200 bg-white p-2 shadow-lg transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div role="group" aria-label="テーマ切り替え">
          {themes.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => selectTheme(item.value)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                theme === item.value
                  ? "bg-teal-50 font-semibold text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{item.label}</span>

              {theme === item.value && (
                <span aria-hidden="true" className="font-bold">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
