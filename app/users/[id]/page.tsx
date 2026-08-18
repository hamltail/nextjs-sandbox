import { notFound, redirect } from "next/navigation";

import { currentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Container from "@/components/Container";
import DeleteMicropostButton from "@/components/DeleteMicropostButton";
import MicropostForm from "@/components/MicropostForm";
import MicropostItem from "@/components/MicropostItem";

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

  const user = await prisma.user.findFirst({
    where: {
      id,
      activated: true,
    },
    include: {
      microposts: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <section className="relative overflow-hidden px-7 py-16 md:px-11 md:py-20 xl:px-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-300/30 blur-3xl"
      />

      <Container>
        <div className="mx-auto max-w-3xl">
          {updated === "true" && (
            <div
              role="status"
              className="mb-8 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700"
            >
              Profile updated successfully.
            </div>
          )}

          <div className="mb-8">
            <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-600">
              PROFILE
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              {user.name}
            </h1>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm md:p-8">
            <div>
              <p className="font-en text-sm font-semibold text-gray-500">
                Email
              </p>

              <p className="mt-2 text-lg">
                {current.admin || current.id === user.id
                  ? user.email
                  : "********@********"}
              </p>
            </div>
          </div>

          {current.id === user.id && (
            <div className="mt-10 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm md:p-8">
              <MicropostForm />
            </div>
          )}

          <div className="mt-10">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-600">
                  MICROPOSTS
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Microposts ({user.microposts.length})
                </h2>
              </div>
            </div>

            {user.microposts.length > 0 ? (
              <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white/90 px-6 shadow-sm backdrop-blur-sm md:px-8">
                {user.microposts.map((micropost) => (
                  <MicropostItem
                    key={micropost.id}
                    micropost={micropost}
                    action={
                      current.id === user.id ? (
                        <DeleteMicropostButton id={micropost.id} />
                      ) : null
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-gray-200 bg-white/90 p-6 text-gray-500 shadow-sm">
                投稿はまだありません。
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
