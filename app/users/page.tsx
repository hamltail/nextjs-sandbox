import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { currentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";

import Container from "@/components/Container";
import DeleteUserButton from "@/components/DeleteUserButton";

const USERS_PER_PAGE = 10;

type PageProps = {
  searchParams: Promise<{
    page?: string;
    deleted?: string;
  }>;
};

export default async function UsersPage({ searchParams }: PageProps) {
  const t = await getTranslations("Users");
  const { page, deleted } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);

  const current = await currentUser();

  if (!current) {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    where: {
      activated: true,
    },
    skip: (currentPage - 1) * USERS_PER_PAGE,
    take: USERS_PER_PAGE,
  });

  const totalUsers = await prisma.user.count({
    where: {
      activated: true,
    },
  });

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  return (
    <section className="bg-background text-foreground relative overflow-hidden px-7 py-16 transition-colors md:px-11 md:py-20 xl:px-0">
      <div
        aria-hidden="true"
        className="bg-glow/30 dark:bg-glow/10 pointer-events-none absolute top-0 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
      />

      <Container>
        <div className="mx-auto max-w-3xl">
          {deleted === "true" && (
            <div
              role="status"
              className="border-primary/20 bg-primary/10 text-primary mb-8 rounded-md border px-4 py-3 text-sm font-medium"
            >
              {t("deleted")}
            </div>
          )}

          <div className="mb-8">
            <p className="font-en text-primary text-sm font-semibold tracking-[0.2em]">
              USERS
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              {t("title")}
            </h1>
          </div>

          <div className="divide-border border-border bg-surface/90 divide-y rounded-2xl border px-6 shadow-sm backdrop-blur-sm transition-colors md:px-8">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 py-6"
              >
                <div>
                  <Link
                    href={`/users/${user.id}`}
                    className="hover:text-accent focus-visible:text-accent text-lg font-semibold transition-colors"
                  >
                    {user.name}
                  </Link>

                  {current.admin && (
                    <p className="text-muted mt-1 text-sm">{user.email}</p>
                  )}
                </div>

                {current.admin && current.id !== user.id && (
                  <DeleteUserButton id={user.id} />
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label={t("paginationLabel")}
              className="mt-8 flex items-center justify-center gap-6"
            >
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;

                return (
                  <Link
                    key={pageNumber}
                    href={`/users?page=${pageNumber}`}
                    aria-current={isCurrentPage ? "page" : undefined}
                    className={
                      isCurrentPage
                        ? "font-en text-accent after:bg-accent relative px-1 py-2 text-base font-semibold after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px"
                        : "font-en nav-link text-muted hover:text-accent focus-visible:text-accent px-1 py-2 text-base transition-colors"
                    }
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </Container>
    </section>
  );
}
