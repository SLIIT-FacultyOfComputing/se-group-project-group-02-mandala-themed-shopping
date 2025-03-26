// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readRoleFromJwt } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // ✅ Allow public access to /products (and children)
  if (url.pathname.startsWith("/products")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: false,
  });

  const accessToken = token?.accessToken;

  // Redirect unauthenticated users from protected routes
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = accessToken ? readRoleFromJwt(accessToken) : "NOROLE";
  console.log("Role", role);

  // Role-based redirection for /dashboard
  if (url.pathname === "/dashboard") {
    if (role === "USER") {
      return NextResponse.redirect(new URL("/products", req.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/products/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|webp|gif|ico|woff2|ttf|eot)).*)",
  ],
};
