import Link from "next/link";
import { redirect } from "next/navigation";

import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Container from "@/components/Container";

const USERS_PER_PAGE = 10;

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function UsersPage({ searchParams }: PageProps) {
  const { page } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);

  const current = await currentUser();

  if (!current) {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    skip: (currentPage - 1) * USERS_PER_PAGE,
    take: USERS_PER_PAGE,
  });

  const totalUsers = await prisma.user.count();

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  return (
    <section className="relative overflow-hidden px-7 py-16 md:px-11 md:py-20 xl:px-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-300/30 blur-3xl"
      />

      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-600">
              USERS
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Users
            </h1>
          </div>

          <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white/90 px-6 shadow-sm backdrop-blur-sm md:px-8">
            {users.map((user) => (
              <div key={user.id} className="py-6">
                <Link
                  href={`/users/${user.id}`}
                  className="text-lg font-semibold transition hover:text-teal-600"
                >
                  {user.name}
                </Link>

                <p className="mt-1 text-sm text-gray-500">
                  {user.email}
                </p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="ユーザー一覧のページネーション"
              className="mt-8 flex items-center justify-center gap-2"
            >
              {currentPage > 1 && (
                <Link
                  href={`/users?page=${currentPage - 1}`}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-teal-400 hover:text-teal-600"
                >
                  Previous
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <Link
                    key={pageNumber}
                    href={`/users?page=${pageNumber}`}
                    className={
                      pageNumber === currentPage
                        ? "inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white"
                        : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-sm font-medium transition hover:border-teal-400 hover:text-teal-600"
                    }
                  >
                    {pageNumber}
                  </Link>
                );
              })}

              {currentPage < totalPages && (
                <Link
                  href={`/users?page=${currentPage + 1}`}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-teal-400 hover:text-teal-600"
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </div>
      </Container>
    </section>
  );
}
