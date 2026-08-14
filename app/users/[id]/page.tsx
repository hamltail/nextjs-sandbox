import { notFound, redirect } from "next/navigation";

import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Container from "@/components/Container";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    updated?: string;
  }>;
};

export default async function UserPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { updated } = await searchParams;
  const current = await currentUser();

  if (!current) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <section className="relative overflow-hidden px-7 py-16 md:px-11 md:py-20 xl:px-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-300/30 blur-3xl"
      />

      <Container>
        <div className="mx-auto max-w-3xl">
          {updated === "true" && (
            <div
              role="status"
              className="mb-8 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700"
            >
              Profile updated successfully.
            </div>
          )}

          <div className="mb-8">
            <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-600">
              PROFILE
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              {user.name}
            </h1>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm md:p-8">
            <div>
              <p className="font-en text-sm font-semibold text-gray-500">
                Email
              </p>

              <p className="mt-2 text-lg">{user.email}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
