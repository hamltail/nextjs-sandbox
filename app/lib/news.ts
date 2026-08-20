import { getNewsFromMicroCMS } from "@/app/lib/microcms";

export async function getNewsStub() {
  return {
    contents: [],
    totalCount: 0,
    offset: 0,
    limit: 3,
  };
}

export const getNews =
  process.env.E2E_TEST === "true" ? getNewsStub : getNewsFromMicroCMS;
