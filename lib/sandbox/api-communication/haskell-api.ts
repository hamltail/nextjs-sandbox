import type { HaskellApiPostsResponse } from "./haskell-api.types";

function getHaskellApiConfig() {
  const apiUrl = process.env.HASKELL_API_URL;
  const apiKey = process.env.HASKELL_API_KEY;

  if (!apiUrl) {
    throw new Error("HASKELL_API_URL is not configured.");
  }

  if (!apiKey) {
    throw new Error("HASKELL_API_KEY is not configured.");
  }

  return {
    apiUrl,
    apiKey,
  };
}

export async function getHaskellPosts(): Promise<HaskellApiPostsResponse> {
  const { apiUrl, apiKey } = getHaskellApiConfig();

  const response = await fetch(`${apiUrl}/api/v1/posts`, {
    headers: {
      "X-API-Key": apiKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Haskell API posts: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<HaskellApiPostsResponse>;
}
