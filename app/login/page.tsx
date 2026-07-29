import Link from "next/link";

import Container from "@/components/Container";

export default function LoginPage() {
  return (
    <section className="px-7 py-12 md:px-11 xl:px-0">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="font-en text-4xl font-bold">Log in</h1>

          <p className="mt-3 text-gray-600">
            Log in to your account.
          </p>

          <form className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>

            <button
              type="submit"
              className="font-en inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal-500 px-6 text-lg font-semibold text-white transition hover:bg-teal-600"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            New user?{" "}
            <Link
              href="/signup"
              className="font-medium text-teal-600 transition hover:text-teal-700"
            >
              Sign up now!
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
