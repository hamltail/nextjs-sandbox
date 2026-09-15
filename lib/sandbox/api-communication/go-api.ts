import type { GoApiPostsResponse } from "./go-api.types";

function getGoApiConfig() {
  const apiUrl = process.env.GO_API_URL;
  const apiKey = process.env.GO_API_KEY;

  if (!apiUrl) {
    throw new Error("GO_API_URL is not configured.");
  }

  if (!apiKey) {
    throw new Error("GO_API_KEY is not configured.");
  }

  return {
    apiUrl,
    apiKey,
  };
}

export async function getGoPosts(): Promise<GoApiPostsResponse> {
  const { apiUrl, apiKey } = getGoApiConfig();

  const response = await fetch(`${apiUrl}/api/v1/posts`, {
    headers: {
      "X-API-Key": apiKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Go API posts: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<GoApiPostsResponse>;
}
