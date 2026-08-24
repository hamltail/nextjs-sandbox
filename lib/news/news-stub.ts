import type { NewsFetcher } from "@/lib/news/news";

export const getNewsStub: NewsFetcher = async () => {
  return {
    contents: [],
    totalCount: 0,
    offset: 0,
    limit: 3,
  };
};
