import { NextResponse } from "next/server";

import { resetSandbox } from "@/lib/sandbox/reset";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  try {
    await resetSandbox();

    return NextResponse.json({
      message: "Sandbox reset completed.",
    });
  } catch (error) {
    console.error("Sandbox reset failed:", error);

    return NextResponse.json(
      {
        message: "Sandbox reset failed.",
      },
      {
        status: 500,
      },
    );
  }
}
