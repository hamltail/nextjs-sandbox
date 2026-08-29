import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { currentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import {
  getFollowersCount,
  getFollowingCount,
  isFollowing,
} from "@/lib/microposts/relationship";

import Container from "@/components/Container";
import DeleteMicropostButton from "@/components/DeleteMicropostButton";
import FollowButton from "@/components/FollowButton";
import MicropostForm from "@/components/MicropostForm";
import MicropostItem from "@/components/MicropostItem";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    updated?: string;
  }>;
};

export default async function UserPage({ params, searchParams }: PageProps) {
  const t = await getTranslations("Profile");
  const { id } = await params;
  const { updated } = await searchParams;
  const current = await currentUser();

  if (!current) {
    redirect("/login");
  }

  const user = await prisma.user.findFirst({
    where: {
      id,
      activated: true,
    },
    include: {
      microposts: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const [followingCount, followersCount] = await Promise.all([
    getFollowingCount(user.id),
    getFollowersCount(user.id),
  ]);

  const following =
    current.id !== user.id ? await isFollowing(current.id, user.id) : false;

  return (
    <section className="relative overflow-hidden bg-white px-7 py-16 text-slate-950 transition-colors dark:bg-slate-950 dark:text-gray-100 md:px-11 md:py-20 xl:px-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-400/10"
      />

      <Container>
        <div className="mx-auto max-w-3xl">
          {updated === "true" && (
            <div
              role="status"
              className="mb-8 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300"
            >
              {t("updated")}
            </div>
          )}

          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-700 dark:text-teal-300">
                PROFILE
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                {user.name}
              </h1>

              <div className="mt-4 flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                <Link
                  href={`/users/${user.id}/following`}
                  className="transition hover:text-teal-600 dark:hover:text-teal-300"
                >
                  <strong className="text-gray-900 dark:text-gray-100">
                    {followingCount}
                  </strong>{" "}
                  {t("following")}
                </Link>

                <Link
                  href={`/users/${user.id}/followers`}
                  className="transition hover:text-teal-600 dark:hover:text-teal-300"
                >
                  <strong className="text-gray-900 dark:text-gray-100">
                    {followersCount}
                  </strong>{" "}
                  {t("followers")}
                </Link>
              </div>
            </div>

            {current.id !== user.id && (
              <FollowButton userId={user.id} initialIsFollowing={following} />
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80 md:p-8">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {t("email")}
              </p>

              <p className="mt-2 text-lg">
                {current.admin || current.id === user.id
                  ? user.email
                  : "********@********"}
              </p>
            </div>
          </div>

          {current.id === user.id && (
            <div className="mt-10 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80 md:p-8">
              <MicropostForm />
            </div>
          )}

          <div className="mt-10">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-700 dark:text-teal-300">
                  MICROPOSTS
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {t("microposts", { count: user.microposts.length })}
                </h2>
              </div>
            </div>

            {user.microposts.length > 0 ? (
              <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white/90 px-6 shadow-sm backdrop-blur-sm transition-colors dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/80 md:px-8">
                {user.microposts.map((micropost) => (
                  <MicropostItem
                    key={micropost.id}
                    micropost={micropost}
                    action={
                      current.id === user.id ? (
                        <DeleteMicropostButton id={micropost.id} />
                      ) : null
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-gray-200 bg-white/90 p-6 text-gray-500 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:text-gray-400">
                {t("empty")}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
