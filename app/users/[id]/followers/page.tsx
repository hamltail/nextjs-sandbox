import Link from "next/link";
import { notFound } from "next/navigation";

import { getFollowers } from "@/app/lib/relationship";
import { prisma } from "@/app/lib/prisma";
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
    <section className="px-7 py-16 md:px-11 md:py-20 xl:px-0">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-600">
              FOLLOWERS
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {user.name} のフォロワー
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {followers.length} followers
            </p>
          </div>

          {followers.length > 0 ? (
            <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white/90 px-6 shadow-sm">
              {followers.map((follower) => (
                <div key={follower.id} className="py-4">
                  <Link
                    href={`/users/${follower.id}`}
                    className="font-semibold transition hover:text-teal-600"
                  >
                    {follower.name}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-gray-200 bg-white/90 p-6 text-gray-500 shadow-sm">
              フォロワーはいません。
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
