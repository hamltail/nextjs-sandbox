import { notFound, redirect } from "next/navigation";

import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Container from "@/components/Container";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;
  const current = await currentUser();

  if (!current) {
    redirect("/login");
  }

  if (current.id !== id) {
    notFound();
  }

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
      <Container>
        <h1 className="text-4xl font-bold">{user.name}</h1>

        <p className="mt-4 text-gray-600">{user.email}</p>
      </Container>
    </section>
  );
}
