import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
) {
  const { params } = await contextPromise; // await context
  const id = params.id;

  const res = await fetch(`http://localhost:8080/api/orders/${id}`);
  if (!res.ok) {
    return new Response("Failed to fetch order", { status: 500 });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
