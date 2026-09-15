import { NextResponse } from "next/server";

import { getGoPosts } from "@/lib/sandbox/api-communication/go-api";

export async function GET() {
  try {
    const response = await getGoPosts();

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "GO_API_ERROR",
          message: "Failed to fetch Go API posts.",
        },
      },
      { status: 502 },
    );
  }
}
