import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/database/prisma";
import { getFollowers } from "@/lib/microposts/relationship";

import Container from "@/components/Container";

type FollowersPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FollowersPage({ params }: FollowersPageProps) {
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
    <section className="bg-white px-7 py-16 text-slate-950 transition-colors dark:bg-slate-950 dark:text-gray-100 md:px-11 md:py-20 xl:px-0">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-700 dark:text-teal-300">
              FOLLOWERS
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {user.name} のフォロワー
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {followers.length} followers
            </p>
          </div>

          {followers.length > 0 ? (
            <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white/90 px-6 shadow-sm transition-colors dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/80">
              {followers.map((follower) => (
                <div key={follower.id} className="py-4">
                  <Link
                    href={`/users/${follower.id}`}
                    className="font-semibold transition hover:text-teal-600 dark:hover:text-teal-300"
                  >
                    {follower.name}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-gray-200 bg-white/90 p-6 text-gray-500 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:text-gray-400">
              フォロワーはいません。
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
