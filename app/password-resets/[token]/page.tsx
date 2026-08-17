import { redirect } from "next/navigation";

import { findValidPasswordResetUser } from "@/app/lib/password-reset";
import Container from "@/components/Container";

type PasswordResetPageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function PasswordResetPage({
  params,
  searchParams,
}: PasswordResetPageProps) {
  const { token } = await params;
  const { email } = await searchParams;

  if (!email) {
    redirect("/password-resets");
  }

  const user = await findValidPasswordResetUser(email, token);

  if (!user) {
    redirect("/password-resets");
  }

  return (
    <section className="px-7 py-12 md:px-11 xl:px-0">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="font-en text-4xl font-bold">Reset password</h1>

          <p className="mt-3 text-gray-600">Enter your new password.</p>

          <form className="mt-8 space-y-6">
            <input type="hidden" name="email" value={email ?? ""} />
            <input type="hidden" name="token" value={token} />

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>

            <div>
              <label
                htmlFor="passwordConfirmation"
                className="block text-sm font-medium"
              >
                Confirm password
              </label>

              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>

            <button
              type="submit"
              className="font-en inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal-500 px-6 text-lg font-semibold text-white transition hover:bg-teal-600"
            >
              Update password
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
