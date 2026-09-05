import { getHaskellPosts } from "@/lib/sandbox/api-communication/haskell-api";

export default async function HaskellApiPosts() {
  const response = await getHaskellPosts();

  return (
    <div className="border-border bg-surface/90 rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-en text-primary text-sm font-semibold tracking-[0.18em] uppercase">
            Haskell API
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">Posts API</h2>
        </div>

        <div className="text-muted text-right text-sm">
          <p>{response.meta.api.language}</p>
          <p>{response.meta.api.category}</p>
        </div>
      </div>

      <p className="text-muted mt-4 text-sm">{response.meta.api.name}</p>

      <div className="mt-6 space-y-4">
        {response.data.posts.map((post) => (
          <article
            key={post.id}
            className="border-border rounded-xl border p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{post.user.displayName}</p>
                <p className="text-muted text-sm">@{post.user.username}</p>
              </div>

              <time className="text-muted text-sm">{post.postedOn}</time>
            </div>

            <p className="mt-4 leading-7">{post.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
