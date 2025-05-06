import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");

  const res = await fetch("http://localhost:8080/api/orders", {
    headers: {
      Authorization: token || "",
    },
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
