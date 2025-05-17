import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8080";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${BACKEND_URL}/api/products/${params.id}`);
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  const formData = await req.formData();
  const image = formData.get("images") as Blob;
  const productJson = formData.get("product")?.toString();

  if (!productJson) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const payload = new FormData();
  payload.append("product", productJson);
  if (image) payload.append("images", image);

  const res = await fetch(`${BACKEND_URL}/api/admin/products/${params.id}`, {
    method: "PUT",
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

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  const res = await fetch(`${BACKEND_URL}/api/admin/products/${params.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return new NextResponse(null, { status: res.status });
}
