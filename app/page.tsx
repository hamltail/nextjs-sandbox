import { currentUser } from "@/app/lib/auth";
import { newsFetcher } from "@/app/lib/dependencies";
import { getNews } from "@/app/lib/news";
import Hero from "@/components/Hero";
import MicropostFeed from "@/components/MicropostFeed";
import NewsSection from "@/components/NewsSection";

export default async function Home() {
  const [response, current] = await Promise.all([
    getNews(newsFetcher),
    currentUser(),
  ]);

  return (
    <>
      {!current && <Hero />}

      <NewsSection newsList={response.contents} />

      {current && <MicropostFeed userId={current.id} />}
    </>
  );
}
