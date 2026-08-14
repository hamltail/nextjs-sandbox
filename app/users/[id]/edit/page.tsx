import { notFound } from "next/navigation";

import Container from "@/components/Container";
import { prisma } from "@/app/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditUserPage({ params }: PageProps) {
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
      <Container>
        <div className="mx-auto max-w-md">
          <h1 className="font-en text-4xl font-bold">Edit profile</h1>

          <p className="mt-3 text-gray-600">
            Update your account information.
          </p>

          <form className="mt-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                defaultValue={user.name}
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={user.email}
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>

            <button
              type="submit"
              className="font-en inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal-500 px-6 text-lg font-semibold text-white transition hover:bg-teal-600"
            >
              Save changes
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
