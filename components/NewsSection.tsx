import Link from "next/link";

import Container from "@/components/Container";
import type { News } from "@/lib/news/news.types";
import type { MicroCMSListContent } from "microcms-js-sdk";

type NewsSectionProps = {
  newsList: (News & MicroCMSListContent)[];
  currentPage: number;
  totalPages: number;
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

export default function NewsSection({
  newsList,
  currentPage,
  totalPages,
}: NewsSectionProps) {
  return (
    <section className="relative overflow-hidden border-t border-gray-100 bg-white px-7 py-16 text-slate-950 transition-colors dark:border-slate-900 dark:bg-slate-950 dark:text-gray-100 md:px-11 md:py-20 xl:px-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-400/10"
      />

      <Container>
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-10">
            <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-600 dark:text-teal-300">
              NEWS
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">お知らせ</h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white/90 px-6 shadow-sm backdrop-blur-sm transition-colors dark:border-slate-800 dark:bg-slate-900/80 md:px-8">
            <div
              key={currentPage}
              className="news-content-reveal divide-y divide-gray-200 dark:divide-slate-800"
            >
              {newsList.map((news) => (
                <article key={news.id} className="py-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    {news.publishedAt && (
                      <time
                        dateTime={news.publishedAt}
                        className="text-sm text-gray-500 dark:text-gray-300"
                      >
                        {formatDate(news.publishedAt)}
                      </time>
                    )}

                    <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
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

          {totalPages > 1 && (
            <nav
              aria-label="お知らせのページネーション"
              className="mt-8 flex items-center justify-center gap-6"
            >
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;

                return (
                  <Link
                    key={pageNumber}
                    href={`/?page=${pageNumber}`}
                    scroll={false}
                    aria-current={isCurrentPage ? "page" : undefined}
                    className={
                      isCurrentPage
                        ? "font-en relative px-1 py-2 text-base font-semibold text-teal-600 after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px after:bg-teal-500 dark:text-teal-300 dark:after:bg-teal-300"
                        : "font-en nav-link px-1 py-2 text-base text-gray-500 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-300"
                    }
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </Container>
    </section>
  );
}
