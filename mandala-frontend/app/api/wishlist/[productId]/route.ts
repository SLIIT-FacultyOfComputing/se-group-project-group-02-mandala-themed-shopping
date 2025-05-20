import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.BACKEND_API_URL || "http://localhost:8080";

export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
  const token = req.headers.get("authorization");
  const userId = req.nextUrl.searchParams.get("userId"); // 📝 userId passed as query param

  if (!token || !userId) {
    return NextResponse.json({ error: "Missing user or token" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BASE}/api/wishlist/${userId}/remove/${params.productId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    const text = await res.text();
    return NextResponse.json({ message: text }, { status: res.status });
  } catch (error) {
    console.error("❌ Failed to remove from wishlist:", error);
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
