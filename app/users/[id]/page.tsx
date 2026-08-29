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
    <section className="bg-background text-foreground relative overflow-hidden px-7 py-16 transition-colors md:px-11 md:py-20 xl:px-0">
      <div
        aria-hidden="true"
        className="bg-glow/30 dark:bg-glow/10 pointer-events-none absolute top-0 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl"
      />

      <Container>
        <div className="mx-auto max-w-3xl">
          {updated === "true" && (
            <div
              role="status"
              className="border-primary/20 bg-primary/10 text-primary mb-8 rounded-md border px-4 py-3 text-sm font-medium"
            >
              {t("updated")}
            </div>
          )}

          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-en text-primary text-sm font-semibold tracking-[0.2em]">
                PROFILE
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                {user.name}
              </h1>

              <div className="text-muted mt-4 flex gap-4 text-sm">
                <Link
                  href={`/users/${user.id}/following`}
                  className="hover:text-primary focus-visible:text-accent transition"
                >
                  <strong className="text-foreground">{followingCount}</strong>{" "}
                  {t("following")}
                </Link>

                <Link
                  href={`/users/${user.id}/followers`}
                  className="hover:text-primary focus-visible:text-accent transition"
                >
                  <strong className="text-foreground">{followersCount}</strong>{" "}
                  {t("followers")}
                </Link>
              </div>
            </div>

            {current.id !== user.id && (
              <FollowButton userId={user.id} initialIsFollowing={following} />
            )}
          </div>

          <div className="border-border bg-surface/90 rounded-2xl border p-6 shadow-sm backdrop-blur-sm transition-colors md:p-8">
            <div>
              <p className="text-muted text-sm font-semibold">{t("email")}</p>

              <p className="mt-2 text-lg">
                {current.admin || current.id === user.id
                  ? user.email
                  : "********@********"}
              </p>
            </div>
          </div>

          {current.id === user.id && (
            <div className="border-border bg-surface/90 mt-10 rounded-2xl border p-6 shadow-sm transition-colors md:p-8">
              <MicropostForm />
            </div>
          )}

          <div className="mt-10">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="font-en text-primary text-sm font-semibold tracking-[0.2em]">
                  MICROPOSTS
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {t("microposts", { count: user.microposts.length })}
                </h2>
              </div>
            </div>

            {user.microposts.length > 0 ? (
              <div className="divide-border border-border bg-surface/90 divide-y rounded-2xl border px-6 shadow-sm backdrop-blur-sm transition-colors md:px-8">
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
              <p className="border-border bg-surface/90 text-muted rounded-2xl border p-6 shadow-sm transition-colors">
                {t("empty")}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
