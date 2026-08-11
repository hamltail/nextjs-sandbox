import { createClient } from "microcms-js-sdk";
import type { News } from "@/app/types/news";

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

export async function getNews() {
  return microcmsClient.getList<News>({
    endpoint: "news",
    queries: {
      limit: 3,
      orders: "-publishedAt",
    },
  });
}
