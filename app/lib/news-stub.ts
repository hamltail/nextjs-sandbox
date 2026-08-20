import type { NewsFetcher } from "@/app/lib/news";

export const getNewsStub: NewsFetcher = async () => {
  return {
    contents: [],
    totalCount: 0,
    offset: 0,
    limit: 3,
  };
};
