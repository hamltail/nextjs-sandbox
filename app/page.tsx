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
            className="flex items-center gap-3 rounded-md border border-teal-300 bg-teal-50 px-5 py-3 text-sm text-teal-700"
          >
            <span aria-hidden="true" className="text-lg font-bold">
              ✓
            </span>

            <p>
              確認メールを送信しました。メール内のリンクからアカウントを有効化してください。
            </p>
          </div>
        </div>
      )}

      {!current && <Hero />}

      <NewsSection newsList={response.contents} />

      {current && <MicropostFeed userId={current.id} />}
    </>
  );
}
