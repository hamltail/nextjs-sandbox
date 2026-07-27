import Link from "next/link";

import Container from "./Container";

const navigationItems = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-7 py-8 md:px-11 xl:px-0">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <small className="text-sm text-gray-600">
            © {new Date().getFullYear()} h-waji (hamltail)
          </small>

          <nav aria-label="フッターナビゲーション">
            <ul className="font-en flex items-center gap-6 text-lg">
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
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
