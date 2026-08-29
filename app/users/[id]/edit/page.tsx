import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { currentUser } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";

import Container from "@/components/Container";
import EditUserForm from "@/components/EditUserForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditUserPage({ params }: PageProps) {
  const t = await getTranslations("EditProfile");
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
    <section className="bg-background text-foreground px-7 py-12 transition-colors md:px-11 xl:px-0">
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="text-4xl font-bold">{t("title")}</h1>

          <p className="text-muted mt-3">{t("description")}</p>

          <EditUserForm id={user.id} name={user.name} email={user.email} />
        </div>
      </Container>
    </section>
  );
}
