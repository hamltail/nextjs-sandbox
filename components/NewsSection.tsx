import Container from "@/components/Container";
import type { News } from "@/app/types/news";
import type { MicroCMSListContent } from "microcms-js-sdk";

type NewsSectionProps = {
  newsList: (News & MicroCMSListContent)[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(date))
    .replaceAll("/", ".");
}

export default function NewsSection({ newsList }: NewsSectionProps) {
  return (
    <section className="relative overflow-hidden border-t border-gray-100 bg-white px-7 py-16 md:px-11 md:py-20 xl:px-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/30 blur-3xl"
      />

      <Container>
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-10">
            <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-600">
              NEWS
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">お知らせ</h2>
          </div>

          <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white/90 px-6 shadow-sm backdrop-blur-sm md:px-8">
            {newsList.map((news) => (
              <article key={news.id} className="py-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  {news.publishedAt && (
                    <time
                      dateTime={news.publishedAt}
                      className="text-sm text-gray-500"
                    >
                      {formatDate(news.publishedAt)}
                    </time>
                  )}

                  <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    {news.category.name}
                  </span>
                </div>

                <h3 className="mt-3 text-lg leading-7 font-semibold">
                  {news.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
