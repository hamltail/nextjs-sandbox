import Link from "next/link";
import { notFound } from "next/navigation";

import { getFollowing } from "@/lib/microposts/relationship";
import { prisma } from "@/app/lib/prisma";
import Container from "@/components/Container";

type FollowingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FollowingPage({ params }: FollowingPageProps) {
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

  const following = await getFollowing(user.id);

  return (
    <section className="px-7 py-16 md:px-11 md:py-20 xl:px-0">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-600">
              FOLLOWING
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {user.name} がフォロー中
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {following.length} following
            </p>
          </div>

          {following.length > 0 ? (
            <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white/90 px-6 shadow-sm">
              {following.map((followedUser) => (
                <div key={followedUser.id} className="py-4">
                  <Link
                    href={`/users/${followedUser.id}`}
                    className="font-semibold transition hover:text-teal-600"
                  >
                    {followedUser.name}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-gray-200 bg-white/90 p-6 text-gray-500 shadow-sm">
              フォローしているユーザーはいません。
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
