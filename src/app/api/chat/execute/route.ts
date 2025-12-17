import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      `${process.env.API_NOTEBOOK_INTERNAL}/api/chat/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Proxy failed", detail: String(err) },
      { status: 500 }
    );
  }
}
