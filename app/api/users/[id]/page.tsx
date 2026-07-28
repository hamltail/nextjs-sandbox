import { notFound } from "next/navigation";

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db",
});

const prisma = new PrismaClient({
  adapter,
});

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <section className="px-7 py-12 md:px-11 xl:px-0">
      <h1 className="text-4xl font-bold">{user.name}</h1>

      <p className="mt-4 text-gray-600">{user.email}</p>
    </section>
  );
}
