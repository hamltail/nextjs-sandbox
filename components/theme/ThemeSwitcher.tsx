"use client";

import { useState } from "react";

import { type Theme, useTheme } from "./ThemeProvider";

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

  function selectTheme(value: Theme) {
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
              className={`flex items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
                theme === item.value
                  ? "bg-accent/10 text-accent"
                  : "hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:text-accent"
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
        className="font-en border-border hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
      >
        Theme
      </button>

      <div
        id="theme-menu"
        className={`border-border bg-surface absolute top-full right-0 z-50 mt-2 w-36 rounded-xl border p-2 shadow-lg transition-all duration-200 ${
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
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                theme === item.value
                  ? "bg-accent/10 text-accent font-semibold"
                  : "hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:text-accent"
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
