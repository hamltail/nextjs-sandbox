import Container from "@/components/Container";

export default function Home() {
  return (
    <section className="px-7 py-12 md:px-11 xl:px-0">
      <Container>
        <h1 className="font-en text-4xl font-bold">
          Next.js Sandbox
        </h1>

        <p className="mt-2">
          Next.jsを学ぶための検証用アプリです。
        </p>
      </Container>
    </section>
  );
}
