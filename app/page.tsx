import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";
import { getNews } from "@/app/lib/microcms";

export default async function Home() {
  const response = await getNews();

  return (
    <>
      <Hero />
      <NewsSection newsList={response.contents} />
    </>
  );
}
