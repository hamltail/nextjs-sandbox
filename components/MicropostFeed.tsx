import { getTranslations } from "next-intl/server";

import { getMicropostFeed } from "@/lib/microposts/micropost";

import MicropostItem from "@/components/MicropostItem";

type MicropostFeedProps = {
  userId: string;
};

export default async function MicropostFeed({ userId }: MicropostFeedProps) {
  const t = await getTranslations("MicropostFeed");
  const microposts = await getMicropostFeed(userId);

  return (
    <section className="bg-background text-foreground px-7 py-16 transition-colors md:px-11 xl:px-0">
      <div className="mx-auto max-w-3xl">
        <p className="font-en text-primary text-sm font-semibold tracking-[0.2em]">
          MICROPOST FEED
        </p>

        <h1 className="mt-2 text-2xl font-bold">{t("title")}</h1>

        {microposts.length > 0 ? (
          <div className="divide-border border-border bg-surface/90 mt-6 divide-y rounded-2xl border px-6 shadow-sm transition-colors">
            {microposts.map((micropost) => (
              <MicropostItem key={micropost.id} micropost={micropost} />
            ))}
          </div>
        ) : (
          <p className="text-muted mt-6">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}
