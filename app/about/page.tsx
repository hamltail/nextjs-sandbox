import Container from "@/components/Container";

export default function AboutPage() {
  return (
    <section className="bg-white px-7 py-16 text-slate-950 transition-colors dark:bg-slate-950 dark:text-gray-100 md:px-11 xl:px-0">
      <Container>
        <div className="fade-in mx-auto max-w-3xl">
          <p className="font-en text-sm font-semibold tracking-[0.2em] text-teal-700 uppercase dark:text-teal-300">
            About
          </p>

          <h1 className="font-en mt-4 text-5xl font-bold tracking-tight">
            hamltail Web Lab
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Next.jsを中心に、Web開発・UI・テスト・品質改善などを
            実際に作りながら検証する個人の実験サイトです。
          </p>

          <div className="mt-18 space-y-18">
            <section>
              <h2 className="text-2xl font-bold">実験環境について</h2>

              <p className="mt-4 leading-8 text-gray-600 dark:text-gray-300">
                認証、データベース、外部サービス連携、UI、
                テスト自動化など、Webアプリケーション開発に関わる技術を検証しています。
                登録されたユーザーや投稿などのテストデータは、
                毎日03:00（JST）に自動削除されます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">プライバシーと免責事項</h2>

              <div className="mt-4 space-y-4 leading-8 text-gray-600 dark:text-gray-300">
                <p>
                  登録情報や投稿データは継続的な保存を保証しておらず、
                  予告なく削除・変更される場合があります。
                </p>

                <p>
                  パスワードや個人情報など、重要な情報や機密情報は登録しないでください。
                </p>

                <p>
                  本サイトの利用によって生じた損害やトラブルについて、
                  運営者は責任を負いかねます。
                </p>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}
