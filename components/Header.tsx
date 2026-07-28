import Link from "next/link";
import Container from "./Container";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Help", href: "/help" },
  { label: "Log in", href: "/login" },
];

export default function Header() {
  return (
    <header className="border-b border-gray-200 px-7 md:px-11 xl:px-0">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="font-en text-2xl font-semibold tracking-wide"
          >
            Sandbox
          </Link>

          <nav aria-label="メインナビゲーション">
            <ul className="font-en flex items-center gap-4 text-lg md:gap-8">
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

              <li>
                <Link
                  href="/signup"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-teal-500 px-5 text-base font-semibold text-white transition hover:bg-teal-600"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
}
