import bcrypt from "bcryptjs";

import { prisma } from "../app/lib/prisma";

async function main() {
  const passwordDigest = await bcrypt.hash("password", 10);

  for (let index = 1; index <= 30; index++) {
    const user = await prisma.user.upsert({
      where: {
        email: `test-user-${index}@example.com`,
      },
      update: {},
      create: {
        name: `Test User ${index}`,
        email: `test-user-${index}@example.com`,
        passwordDigest,
        activated: true,
        activatedAt: new Date(),
      },
    });

    const micropostCount = await prisma.micropost.count({
      where: {
        userId: user.id,
      },
    });

    if (micropostCount === 0) {
      await prisma.micropost.createMany({
        data: Array.from({ length: 30 }, (_, postIndex) => ({
          userId: user.id,
          content: `Test User ${index} の投稿 ${postIndex + 1}`,
        })),
      });
    }
  }

  // Test User 1〜10  → Test User 11〜20
  // Test User 11〜20 → Test User 21〜30
  // Test User 21〜30 → Test User 1〜10
  const relationshipGroups = [
    { followerStart: 1, followerEnd: 10, followedStart: 11, followedEnd: 20 },
    { followerStart: 11, followerEnd: 20, followedStart: 21, followedEnd: 30 },
    { followerStart: 21, followerEnd: 30, followedStart: 1, followedEnd: 10 },
  ];

  for (const group of relationshipGroups) {
    for (
      let followerNumber = group.followerStart;
      followerNumber <= group.followerEnd;
      followerNumber++
    ) {
      const follower = await prisma.user.findUnique({
        where: {
          email: `test-user-${followerNumber}@example.com`,
        },
      });

      if (!follower) {
        continue;
      }

      for (
        let followedNumber = group.followedStart;
        followedNumber <= group.followedEnd;
        followedNumber++
      ) {
        const followed = await prisma.user.findUnique({
          where: {
            email: `test-user-${followedNumber}@example.com`,
          },
        });

        if (!followed) {
          continue;
        }

        await prisma.relationship.upsert({
          // followerId + followedId の組み合わせは @@unique なので、
          // 複合ユニークキーを使って既存のRelationshipを特定する
          where: {
            followerId_followedId: {
              followerId: follower.id,
              followedId: followed.id,
            },
          },
          update: {},
          create: {
            followerId: follower.id,
            followedId: followed.id,
          },
        });
      }
    }
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
