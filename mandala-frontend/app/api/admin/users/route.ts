import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  console.log("[ADMIN USERS API] Incoming request to /api/admin/users");
  console.log("[ADMIN USERS API] Authorization Header:", authHeader);

  if (!authHeader) {
    console.warn("[ADMIN USERS API] Missing Authorization header");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const backendUrl = `${process.env.BACKEND_API_URL}/api/users`;
    console.log("[ADMIN USERS API] Forwarding request to backend:", backendUrl);

    const response = await fetch(backendUrl, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    console.log("[ADMIN USERS API] Backend response status:", response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error("[ADMIN USERS API] Backend responded with error:", data);
      return NextResponse.json(data, { status: response.status });
    }

    console.log("[ADMIN USERS API] Users fetched successfully");
    return NextResponse.json(data);
  } catch (err) {
    console.error("[ADMIN USERS API] Exception caught:", err);
    return NextResponse.json({ message: "Failed to fetch users", error: err }, { status: 500 });
  }
}
