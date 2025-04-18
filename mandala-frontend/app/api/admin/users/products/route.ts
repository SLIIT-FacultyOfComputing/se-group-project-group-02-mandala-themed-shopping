// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readRoleFromJwt } from "@/lib/auth";

const BASE_URL = "http://localhost:8080/api/admin/products";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const role = token ? readRoleFromJwt(token) : null;

  if (!token || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
