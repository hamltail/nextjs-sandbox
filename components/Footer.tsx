import Container from "./Container";

const externalLinks = [
  {
    label: "note",
    href: "https://note.com/hamltail",
  },
  {
    label: "Zenn",
    href: "https://zenn.dev/hamltail",
  },
];

export default function Footer() {
  return (
    <footer className="bg-background border-border border-t px-7 py-8 transition-colors md:px-11 xl:px-0">
      <Container>
        <div className="flex flex-col items-center gap-5 md:grid md:grid-cols-3 md:gap-0">
          <small className="text-muted text-sm md:col-start-2 md:text-center">
            © {new Date().getFullYear()} h-waji (hamltail)
          </small>

          <nav
            aria-label="外部リンク"
            className="md:col-start-3 md:row-start-1 md:justify-self-end md:pr-4"
          >
            <ul className="font-en flex items-center gap-6 text-base">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link focus-visible:outline-primary transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
