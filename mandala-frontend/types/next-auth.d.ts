import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }

  interface User extends DefaultUser {
    token?: string; // ✅ Add token here
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
