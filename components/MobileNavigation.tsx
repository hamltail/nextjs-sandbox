"use client";

import Link from "next/link";
import { useState } from "react";

import LogoutButton from "./LogoutButton";
import ThemeSwitcher from "./theme/ThemeSwitcher";

type MobileNavigationProps = {
  user: {
    id: string;
    name: string;
  } | null;
};

export default function MobileNavigation({ user }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        onClick={() => setIsOpen((current) => !current)}
        className="flex size-10 items-center justify-center"
      >
        <span className="sr-only">
          {isOpen ? "メニューを閉じる" : "メニューを開く"}
        </span>

        <span aria-hidden="true" className="relative block h-5 w-6">
          <span
            className={`absolute left-0 top-0.5 h-0.5 w-6 bg-current transition duration-300 ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />

          <span
            className={`absolute left-0 top-2.5 h-0.5 w-6 bg-current transition duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />

          <span
            className={`absolute left-0 top-[18px] h-0.5 w-6 bg-current transition duration-300 ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <nav
        id="mobile-navigation"
        aria-label="モバイルナビゲーション"
        className={`absolute inset-x-0 top-16 z-50 border-b border-gray-200 bg-white px-7 py-6 text-slate-950 transition-all duration-300 ease-out dark:border-slate-800 dark:bg-slate-950 dark:text-gray-100 ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <ul className="font-en flex flex-col gap-5 text-lg">
          <li>
            <Link
              href="/"
              onClick={closeMenu}
              className="transition-opacity hover:opacity-60"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/about"
              onClick={closeMenu}
              className="transition-opacity hover:opacity-60"
            >
              About
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link
                  href="/users"
                  onClick={closeMenu}
                  className="transition-opacity hover:opacity-60"
                >
                  Users
                </Link>
              </li>

              <li>
                <Link
                  href={`/users/${user.id}`}
                  onClick={closeMenu}
                  className="transition-opacity hover:opacity-60"
                >
                  {user.name}
                </Link>
              </li>

              <li>
                <Link
                  href={`/users/${user.id}/edit`}
                  onClick={closeMenu}
                  className="transition-opacity hover:opacity-60"
                >
                  Settings
                </Link>
              </li>

              <li>
                <LogoutButton />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="transition-opacity hover:opacity-60"
                >
                  Log in
                </Link>
              </li>

              <li>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-teal-500 px-5 font-semibold text-white transition hover:bg-teal-600 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300"
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-slate-800">
          <ThemeSwitcher variant="list" />
        </div>
      </nav>
    </div>
  );
}
