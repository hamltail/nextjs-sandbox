import type { MicroCMSListResponse } from "microcms-js-sdk";

import type { News } from "@/lib/news/news.types";

type NewsQueries = {
  limit: number;
  offset: number;
};

export type NewsFetcher = (
  queries: NewsQueries,
) => Promise<MicroCMSListResponse<News>>;

export async function getNews(fetchNews: NewsFetcher, queries: NewsQueries) {
  return fetchNews(queries);
}
