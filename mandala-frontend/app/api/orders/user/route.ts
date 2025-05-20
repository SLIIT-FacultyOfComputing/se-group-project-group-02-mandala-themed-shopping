import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`http://localhost:8080/api/orders/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`, // ✅ Include JWT here
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch user orders");
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
