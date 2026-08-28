import { hashPassword } from "../lib/auth/password";
import { prisma } from "../lib/database/prisma";

export async function seedDatabase() {
  const passwordDigest = await hashPassword("password");

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
      const microposts = [];

      // 過去6日分の投稿を作成する
      for (let daysAgo = 6; daysAgo >= 1; daysAgo--) {
        for (let postIndex = 0; postIndex < 5; postIndex++) {
          const createdAt = new Date();

          // 過去の日付にずらす
          createdAt.setDate(createdAt.getDate() - daysAgo);

          // 同じ日の投稿時刻をずらす
          // 09:00, 11:00, 13:00, 15:00, 17:00
          createdAt.setHours(9 + postIndex * 2, 0, 0, 0);

          microposts.push({
            userId: user.id,
            content: `Test User ${index} の${daysAgo}日前の投稿 ${postIndex + 1}`,
            createdAt,
          });
        }
      }

      await prisma.micropost.createMany({
        data: microposts,
      });
    }
  }

  // Test User 1〜10  → Test User 11〜20
  // Test User 11〜20 → Test User 21〜30
  // Test User 21〜30 → Test User 1〜10
  const relationshipGroups = [
    {
      followerStart: 1,
      followerEnd: 10,
      followedStart: 11,
      followedEnd: 20,
    },
    {
      followerStart: 11,
      followerEnd: 20,
      followedStart: 21,
      followedEnd: 30,
    },
    {
      followerStart: 21,
      followerEnd: 30,
      followedStart: 1,
      followedEnd: 10,
    },
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
}
