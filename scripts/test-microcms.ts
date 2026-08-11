import { loadEnvConfig } from "@next/env";
import type { News } from "../app/types/news";

loadEnvConfig(process.cwd());

async function main() {
  const { microcmsClient } = await import("../app/lib/microcms");

  const response = await microcmsClient.getList<News>({
    endpoint: "news",
  });

  // console.log(response);
  console.log(response.contents[0].title);
  console.log(response.contents[0].category.name);
  console.dir(response, { depth: null });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
