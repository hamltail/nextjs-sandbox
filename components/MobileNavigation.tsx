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
            className={`absolute left-0 top-4.5 h-0.5 w-6 bg-current transition duration-300 ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <nav
        id="mobile-navigation"
        aria-label="モバイルナビゲーション"
        className={`bg-background text-foreground border-border absolute inset-x-0 top-16 z-50 border-b px-7 py-6 transition-all duration-300 ease-out ${
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
                  className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex min-h-10 items-center justify-center rounded-full px-5 font-semibold transition"
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="border-border mt-6 border-t pt-6">
          <ThemeSwitcher variant="list" />
        </div>
      </nav>
    </div>
  );
}
