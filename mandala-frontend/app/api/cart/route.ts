import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.BACKEND_API_URL;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const body = await req.text();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const res = await fetch(`${BASE}/api/cart`, {
      method: "POST",
      headers: {
        Authorization: token, // already has "Bearer ..."
        "Content-Type": "application/json",
      },
      body,
    });

    const text = await res.text();

    return new NextResponse(text, { status: res.status });
  } catch (err) {
    console.error("Error forwarding request to backend:", err);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    );
  }
}
