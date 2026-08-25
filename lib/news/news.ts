import type { MicroCMSListResponse } from "microcms-js-sdk";

import type { News } from "@/lib/news/news.types";

export type NewsFetcher = () => Promise<MicroCMSListResponse<News>>;

export async function getNews(fetchNews: NewsFetcher) {
  return fetchNews();
}
