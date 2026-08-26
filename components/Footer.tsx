import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-7 py-8 transition-colors dark:border-slate-800 dark:bg-slate-950 md:px-11 xl:px-0">
      <Container>
        <small className="block text-center text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} h-waji (hamltail)
        </small>
      </Container>
    </footer>
  );
}
