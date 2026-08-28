import { redirect } from "next/navigation";

import { findValidPasswordResetUser } from "@/lib/auth/password-reset";

import Container from "@/components/Container";
import PasswordResetForm from "@/components/password-reset/PasswordResetForm";

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
    <section className="bg-white px-7 py-12 text-slate-950 transition-colors dark:bg-slate-950 dark:text-gray-100 md:px-11 xl:px-0">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="font-en text-4xl font-bold">Reset password</h1>

          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Enter your new password.
          </p>

          <PasswordResetForm email={email} token={token} />
        </div>
      </Container>
    </section>
  );
}
