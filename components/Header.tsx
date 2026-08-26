import Link from "next/link";

import { currentUser } from "@/lib/auth/auth";

import Container from "./Container";
import LogoutButton from "./LogoutButton";
import MobileNavigation from "./MobileNavigation";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export default async function Header() {
  const user = await currentUser();

  return (
    <header className="relative border-b border-gray-200 px-7 md:px-11 xl:px-0">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="font-en text-2xl font-semibold tracking-wide"
          >
            hamltail Web Lab
          </Link>

          <nav aria-label="メインナビゲーション" className="hidden md:block">
            <ul className="font-en flex items-center gap-8 text-lg">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-opacity hover:opacity-60"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {user ? (
                <>
                  <li>
                    <Link
                      href="/users"
                      className="transition-opacity hover:opacity-60"
                    >
                      Users
                    </Link>
                  </li>

                  <li>
                    <Link
                      href={`/users/${user.id}`}
                      className="transition-opacity hover:opacity-60"
                    >
                      {user.name}
                    </Link>
                  </li>

                  <li>
                    <Link
                      href={`/users/${user.id}/edit`}
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
                      className="transition-opacity hover:opacity-60"
                    >
                      Log in
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/signup"
                      className="inline-flex min-h-10 items-center justify-center rounded-full bg-teal-500 px-5 text-base font-semibold text-white transition hover:bg-teal-600"
                    >
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <MobileNavigation
            user={
              user
                ? {
                    id: user.id,
                    name: user.name,
                  }
                : null
            }
          />
        </div>
      </Container>
    </header>
  );
}
