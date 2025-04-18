import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.BACKEND_API_URL;

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization");
  const body = await req.text();

  const res = await fetch(`${BASE}/api/orders/checkout`, {
    method: "POST",
    headers: {
      Authorization: token!,
      "Content-Type": "application/json",
    },
    body,
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
