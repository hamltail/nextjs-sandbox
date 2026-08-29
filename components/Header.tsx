import Link from "next/link";

import { currentUser } from "@/lib/auth/auth";

import Container from "./Container";
import LogoutButton from "./LogoutButton";
import MobileNavigation from "./MobileNavigation";
import ThemeSwitcher from "./theme/ThemeSwitcher";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export default async function Header() {
  const user = await currentUser();

  return (
    <header className="bg-background text-foreground border-border relative border-b px-7 transition-colors md:px-11 xl:px-0">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="font-en text-2xl font-semibold tracking-wide"
          >
            hamltail Web Lab
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <nav aria-label="メインナビゲーション">
              <ul className="font-en flex items-center gap-8 text-lg">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="nav-link transition-opacity hover:opacity-60"
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
                        className="nav-link transition-opacity hover:opacity-60"
                      >
                        Users
                      </Link>
                    </li>

                    <li>
                      <Link
                        href={`/users/${user.id}`}
                        className="nav-link transition-opacity hover:opacity-60"
                      >
                        {user.name}
                      </Link>
                    </li>

                    <li>
                      <Link
                        href={`/users/${user.id}/edit`}
                        className="nav-link transition-opacity hover:opacity-60"
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
                        className="nav-link transition-opacity hover:opacity-60"
                      >
                        Log in
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/signup"
                        className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex min-h-10 items-center justify-center rounded-full px-5 text-base font-semibold transition"
                      >
                        Sign up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            <ThemeSwitcher />
          </div>

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
