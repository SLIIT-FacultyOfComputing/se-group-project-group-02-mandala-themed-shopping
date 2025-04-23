import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_API_URL || "http://localhost:8080";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { productId: string } }
): Promise<NextResponse> {
  const token = request.headers.get("authorization");
  const userId = request.nextUrl.searchParams.get("userId");

  // Validate required parameters
  if (!token) {
    return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 }
    );
  }

  if (!userId) {
    return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
    );
  }

  try {
    const response = await fetch(
        `${BASE_URL}/api/wishlist/${userId}/remove/${params.productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
    );

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
          {
            error: "Failed to remove from wishlist",
            details: errorData
          },
          { status: response.status }
      );
    }

    const successMessage = await response.text();
    return NextResponse.json(
        { message: successMessage || "Item removed from wishlist" },
        { status: 200 }
    );

  } catch (error) {
    console.error("❌ Failed to remove from wishlist:", error);
    return NextResponse.json(
        {
          error: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
    );
  }
}