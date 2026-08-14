import Link from "next/link";
import { redirect } from "next/navigation";

import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Container from "@/components/Container";

export default async function UsersPage() {
  const current = await currentUser();

  if (!current) {
    redirect("/login");
  }

  const users = await prisma.user.findMany();

  return (
    <section className="px-7 py-12 md:px-11 xl:px-0">
      <Container>
        <h1 className="font-en text-4xl font-bold">Users</h1>

        <div className="mt-8 space-y-4">
          {users.map((user) => (
            <div key={user.id}>
              <Link
                href={`/users/${user.id}`}
                className="font-medium transition-opacity hover:opacity-60"
              >
                {user.name}
              </Link>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
