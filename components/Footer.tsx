import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-7 py-8 md:px-11 xl:px-0">
      <Container>
        <small className="block text-center text-sm text-gray-600">
          © {new Date().getFullYear()} h-waji (hamltail)
        </small>
      </Container>
    </footer>
  );
}
