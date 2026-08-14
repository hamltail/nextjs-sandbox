import { notFound, redirect } from "next/navigation";

import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Container from "@/components/Container";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    updated?: string;
  }>;
};

export default async function UserPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { updated } = await searchParams;
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
        {updated === "true" && (
          <div
            role="status"
            className="mb-8 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700"
          >
            Profile updated successfully.
          </div>
        )}

        <h1 className="text-4xl font-bold">{user.name}</h1>

        <p className="mt-4 text-gray-600">{user.email}</p>
      </Container>
    </section>
  );
}
