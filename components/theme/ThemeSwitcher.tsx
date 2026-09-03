"use client";

import { useState, useSyncExternalStore } from "react";

import { useTheme } from "./ThemeProvider";

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

const subscribe = () => () => {};

type ThemeSwitcherProps = {
  variant?: "dropdown" | "list";
};

export default function ThemeSwitcher({
  variant = "dropdown",
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

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
          {themes.map((item) => {
            const isActive = mounted && theme === item.value;

            return (
              <button
                key={item.value}
                type="button"
                disabled={!mounted}
                onClick={() => setTheme(item.value)}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:text-accent"
                }`}
              >
                <span>{item.label}</span>

                {isActive && (
                  <span aria-hidden="true" className="font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
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
        disabled={!mounted}
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
          {themes.map((item) => {
            const isActive = mounted && theme === item.value;

            return (
              <button
                key={item.value}
                type="button"
                disabled={!mounted}
                onClick={() => {
                  setTheme(item.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent font-semibold"
                    : "hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:text-accent"
                }`}
              >
                <span>{item.label}</span>

                {isActive && (
                  <span aria-hidden="true" className="font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
