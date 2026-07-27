import Link from "next/link";
import Container from "@/components/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-7 py-20 md:px-11 md:py-28 xl:px-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_42%)]"
      />

      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="font-en mb-5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold tracking-widest text-emerald-700">
            NEXT.JS LEARNING SANDBOX
          </p>

          <h1 className="font-en text-5xl leading-none font-bold tracking-tight md:text-7xl">
            Build, test, and learn.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
            Next.jsの機能を実際に作りながら検証し、
            モダンなWebアプリケーション開発を学ぶためのSandboxです。
          </p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="font-en inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-500 px-8 text-lg font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              Get Started
            </Link>

            <Link
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-en inline-flex min-h-12 items-center justify-center rounded-full border border-gray-300 bg-white px-8 text-lg font-semibold transition hover:border-gray-400 hover:bg-gray-50"
            >
              Next.js Docs
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
