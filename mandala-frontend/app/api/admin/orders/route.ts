import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const backendUrl = `${process.env.BACKEND_API_URL}/api/orders/admin`;

    const response = await fetch(backendUrl, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Expecting an array directly from Spring Boot backend
    if (!Array.isArray(data)) {
      return NextResponse.json({ message: "Invalid data format" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch orders", error: err }, { status: 500 });
  }
}
