import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8080";

export async function GET(req: NextRequest) {
  const res = await fetch(`${BACKEND_URL}/api/products`, {
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  const formData = await req.formData();
  const image = formData.get("images") as Blob;
  const productJson = formData.get("product")?.toString();

  if (!productJson || !image) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const payload = new FormData();
  payload.append("product", productJson);
  payload.append("images", image);

  const res = await fetch(`${BACKEND_URL}/api/admin/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });

  const data = await res.json();
  return new NextResponse(JSON.stringify(data), {
    status: res.status,
  });
}
