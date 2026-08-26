import { currentUser } from "@/lib/auth/auth";
import { newsFetcher } from "@/lib/news/dependencies";
import { getNews } from "@/lib/news/news";
import Hero from "@/components/Hero";
import MicropostFeed from "@/components/MicropostFeed";
import NewsSection from "@/components/NewsSection";
import SignupSuccessMessage from "@/components/SignupSuccessMessage";

type HomeProps = {
  searchParams: Promise<{
    signup?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const [response, current] = await Promise.all([
    getNews(newsFetcher),
    currentUser(),
  ]);

  const signupSucceeded = params.signup === "success";

  return (
    <div className="min-h-screen bg-white text-slate-950 transition-colors dark:bg-slate-950 dark:text-gray-100">
      {!current && (
        <>
          <div className="relative">
            {signupSucceeded && <SignupSuccessMessage />}
            <Hero />
          </div>

          <NewsSection newsList={response.contents} />
        </>
      )}

      {current && <MicropostFeed userId={current.id} />}
    </div>
  );
}
