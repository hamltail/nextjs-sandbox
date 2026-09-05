import { NextResponse } from "next/server";

import { getHaskellPosts } from "@/lib/sandbox/api-communication/haskell-api";

export async function GET() {
  try {
    const response = await getHaskellPosts();

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "HASKELL_API_ERROR",
          message: "Failed to fetch Haskell API posts.",
        },
      },
      { status: 502 },
    );
  }
}
