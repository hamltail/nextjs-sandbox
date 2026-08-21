import { currentUser } from "@/app/lib/auth";
import { newsFetcher } from "@/app/lib/dependencies";
import { getNews } from "@/app/lib/news";
import Hero from "@/components/Hero";
import MicropostFeed from "@/components/MicropostFeed";
import NewsSection from "@/components/NewsSection";

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
    <>
      {signupSucceeded && (
        <div className="mx-auto mt-6 max-w-5xl px-7 md:px-11 xl:px-0">
          <div
            role="status"
            className="rounded-md border border-teal-300 bg-teal-50 px-4 py-3 text-sm text-teal-700"
          >
            確認メールを送信しました。メール内のリンクからアカウントを有効化してください。
          </div>
        </div>
      )}

      {!current && <Hero />}

      <NewsSection newsList={response.contents} />

      {current && <MicropostFeed userId={current.id} />}
    </>
  );
}
