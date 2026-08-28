import { getMicropostFeed } from "@/lib/microposts/micropost";

import MicropostItem from "@/components/MicropostItem";

type MicropostFeedProps = {
  userId: string;
};

export default async function MicropostFeed({ userId }: MicropostFeedProps) {
  const microposts = await getMicropostFeed(userId);

  return (
    <section className="bg-white px-7 py-16 text-slate-950 transition-colors dark:bg-slate-950 dark:text-gray-100 md:px-11 xl:px-0">
      <div className="mx-auto max-w-3xl">
        <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-700 dark:text-teal-300">
          MICROPOST FEED
        </p>

        <h1 className="mt-2 text-2xl font-bold">Micropost Feed</h1>

        {microposts.length > 0 ? (
          <div className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white/90 px-6 shadow-sm transition-colors dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/80">
            {microposts.map((micropost) => (
              <MicropostItem key={micropost.id} micropost={micropost} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-gray-500 dark:text-gray-300">
            投稿はまだありません。
          </p>
        )}
      </div>
    </section>
  );
}
