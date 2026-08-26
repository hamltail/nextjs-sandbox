import { currentUser } from "@/lib/auth/auth";
import { newsFetcher } from "@/lib/news/dependencies";
import { getNews } from "@/lib/news/news";
import Hero from "@/components/Hero";
import MicropostFeed from "@/components/MicropostFeed";
import NewsSection from "@/components/NewsSection";
import SignupSuccessMessage from "@/components/SignupSuccessMessage";

const NEWS_PER_PAGE = 3;

type HomeProps = {
  searchParams: Promise<{
    signup?: string;
    page?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const currentPage = Math.max(Number(params.page) || 1, 1);

  const [response, current] = await Promise.all([
    getNews(newsFetcher, {
      limit: NEWS_PER_PAGE,
      offset: (currentPage - 1) * NEWS_PER_PAGE,
    }),
    currentUser(),
  ]);

  const signupSucceeded = params.signup === "success";

  const totalPages = Math.ceil(response.totalCount / NEWS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white text-slate-950 transition-colors dark:bg-slate-950 dark:text-gray-100">
      {!current && (
        <>
          <div className="relative">
            {signupSucceeded && <SignupSuccessMessage />}
            <Hero />
          </div>

          <NewsSection
            newsList={response.contents}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}

      {current && <MicropostFeed userId={current.id} />}
    </div>
  );
}
