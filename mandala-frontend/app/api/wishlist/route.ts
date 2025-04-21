import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.BACKEND_API_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization");
  const body = await req.json();
  const { productId, userId } = body;

  if (!token || !userId || !productId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 }); // ✅ this is what you're hitting
  }

  try {
    const res = await fetch(`${BASE}/api/wishlist/${userId}/add/${productId}`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
    });

    const text = await res.text();
    return NextResponse.json({ message: text }, { status: res.status });
  } catch (err) {
    console.error("Failed to add to wishlist:", err);
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}
