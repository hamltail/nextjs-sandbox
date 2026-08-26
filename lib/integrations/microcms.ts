import { createClient } from "microcms-js-sdk";

import type { NewsFetcher } from "@/lib/news/news";
import type { News } from "@/lib/news/news.types";

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is not defined");
}

if (!apiKey) {
  throw new Error("MICROCMS_API_KEY is not defined");
}

export const microcmsClient = createClient({
  serviceDomain,
  apiKey,
});

export const getNewsFromMicroCMS: NewsFetcher = async ({ limit, offset }) => {
  return microcmsClient.getList<News>({
    endpoint: "news",
    queries: {
      limit,
      offset,
      orders: "-publishedAt",
    },
  });
};
