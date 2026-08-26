import type { NewsFetcher } from "@/lib/news/news";

export const getNewsStub: NewsFetcher = async ({ limit, offset }) => {
  return {
    contents: [],
    totalCount: 0,
    offset,
    limit,
  };
};
