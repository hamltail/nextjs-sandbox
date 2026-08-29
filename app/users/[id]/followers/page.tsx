import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/database/prisma";
import { getFollowers } from "@/lib/microposts/relationship";

import Container from "@/components/Container";

type FollowersPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FollowersPage({ params }: FollowersPageProps) {
  const t = await getTranslations("Followers");
  const { id } = await params;

  const user = await prisma.user.findFirst({
    where: {
      id,
      activated: true,
    },
  });

  if (!user) {
    notFound();
  }

  const followers = await getFollowers(user.id);

  return (
    <section className="bg-background text-foreground px-7 py-16 transition-colors md:px-11 md:py-20 xl:px-0">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="font-en text-primary text-sm font-semibold tracking-[0.2em]">
              FOLLOWERS
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {t("title", { name: user.name })}
            </h1>

            <p className="text-muted mt-2 text-sm">
              {t("count", { count: followers.length })}
            </p>
          </div>

          {followers.length > 0 ? (
            <div className="divide-border border-border bg-surface/90 divide-y rounded-2xl border px-6 shadow-sm transition-colors">
              {followers.map((follower) => (
                <div key={follower.id} className="py-4">
                  <Link
                    href={`/users/${follower.id}`}
                    className="hover:text-primary focus-visible:text-accent font-semibold transition"
                  >
                    {follower.name}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="border-border bg-surface/90 text-muted rounded-2xl border p-6 shadow-sm transition-colors">
              {t("empty")}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
