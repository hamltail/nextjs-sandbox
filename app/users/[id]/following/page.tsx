import Link from "next/link";
import { notFound } from "next/navigation";

import { getFollowing } from "@/app/lib/relationship";
import { prisma } from "@/app/lib/prisma";

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
    <main>
      <h1>{user.name} がフォロー中</h1>

      <p>{following.length} following</p>

      <ul>
        {following.map((followedUser) => (
          <li key={followedUser.id}>
            <Link href={`/users/${followedUser.id}`}>{followedUser.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
