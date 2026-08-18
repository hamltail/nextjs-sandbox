import { getMicropostFeed } from "@/app/lib/micropost";
import MicropostItem from "@/components/MicropostItem";

type MicropostFeedProps = {
  userId: string;
};

export default async function MicropostFeed({ userId }: MicropostFeedProps) {
  const microposts = await getMicropostFeed(userId);

  return (
    <section className="px-7 py-16 md:px-11 xl:px-0">
      <div className="mx-auto max-w-3xl">
        <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-600">
          MICROPOST FEED
        </p>

        <h2 className="mt-2 text-2xl font-bold">Micropost Feed</h2>

        {microposts.length > 0 ? (
          <div className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white/90 px-6 shadow-sm">
            {microposts.map((micropost) => (
              <MicropostItem key={micropost.id} micropost={micropost} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-gray-500">投稿はまだありません。</p>
        )}
      </div>
    </section>
  );
}
