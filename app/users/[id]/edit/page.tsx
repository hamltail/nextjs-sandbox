import { notFound, redirect } from "next/navigation";

import { currentUser } from "@/app/lib/auth";
import Container from "@/components/Container";
import EditUserForm from "@/components/EditUserForm";
import { prisma } from "@/app/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditUserPage({ params }: PageProps) {
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
        <div className="mx-auto max-w-md">
          <h1 className="font-en text-4xl font-bold">Edit profile</h1>

          <p className="mt-3 text-gray-600">Update your account information.</p>

          <EditUserForm id={user.id} name={user.name} email={user.email} />
        </div>
      </Container>
    </section>
  );
}
