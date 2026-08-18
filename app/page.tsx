import { currentUser } from "@/app/lib/auth";
import { getNews } from "@/app/lib/microcms";
import Hero from "@/components/Hero";
import MicropostFeed from "@/components/MicropostFeed";
import NewsSection from "@/components/NewsSection";

export default async function Home() {
  const [response, current] = await Promise.all([getNews(), currentUser()]);

  return (
    <>
      {!current && <Hero />}

      <NewsSection newsList={response.contents} />

      {current && <MicropostFeed userId={current.id} />}
    </>
  );
}
