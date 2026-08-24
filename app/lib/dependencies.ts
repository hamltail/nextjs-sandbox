import { getNewsFromMicroCMS } from "@/lib/integrations/microcms";
import { getNewsStub } from "@/app/lib/news-stub";

export const newsFetcher =
  process.env.E2E_TEST === "true" ? getNewsStub : getNewsFromMicroCMS;
