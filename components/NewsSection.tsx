import Link from "next/link";
import type { MicroCMSListContent } from "microcms-js-sdk";
import { useLocale, useTranslations } from "next-intl";

import Container from "@/components/Container";
import type { News } from "@/lib/news/news.types";

type NewsSectionProps = {
  newsList: (News & MicroCMSListContent)[];
  currentPage: number;
  totalPages: number;
};

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
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
  const t = useTranslations("News");
  const locale = useLocale();

  return (
    <section className="bg-background text-foreground border-border relative overflow-hidden border-t px-7 py-16 transition-colors md:px-11 md:py-20 xl:px-0">
      <div
        aria-hidden="true"
        className="bg-accent/30 dark:bg-accent/30 pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      />

      <Container>
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-10">
            <p className="font-en text-primary text-sm font-semibold tracking-[0.2em]">
              {t("label")}
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {t("title")}
            </h2>
          </div>

          <div className="border-border bg-surface/90 rounded-2xl border px-6 shadow-sm backdrop-blur-sm transition-colors md:px-8">
            <div key={currentPage} className="fade-in divide-border divide-y">
              {newsList.map((news) => (
                <article key={news.id} className="py-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    {news.publishedAt && (
                      <time
                        dateTime={news.publishedAt}
                        className="text-muted text-sm"
                      >
                        {formatDate(news.publishedAt, locale)}
                      </time>
                    )}

                    <span className="bg-primary/10 text-primary w-fit rounded-full px-3 py-1 text-xs font-semibold">
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
              aria-label={t("paginationLabel")}
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
                        ? "font-en text-accent after:bg-accent relative px-1 py-2 text-base font-semibold after:absolute after:right-0 after:-bottom-0.5 after:left-0 after:h-px"
                        : "font-en nav-link text-muted hover:text-accent focus-visible:text-accent px-1 py-2 text-base transition-colors"
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
