import { prisma } from "@/app/lib/prisma";
import Container from "@/components/Container";

export default async function UsersPage() {
  const users = await prisma.user.findMany();

  return (
    <section className="px-7 py-12 md:px-11 xl:px-0">
      <Container>
        <h1 className="font-en text-4xl font-bold">Users</h1>

        <div className="mt-8 space-y-4">
          {users.map((user) => (
            <div key={user.id}>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
