import type { MicroCMSListResponse } from "microcms-js-sdk";

import type { News } from "@/app/types/news";

export type NewsFetcher = () => Promise<MicroCMSListResponse<News>>;

export async function getNews(fetchNews: NewsFetcher) {
  return fetchNews();
}
