import { jwtDecode } from "jwt-decode";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface JwtPayload {
  role: string;
  sub: string;
  iat: number;
  exp: number;
  accessToken?: string;
}

export const readRoleFromJwt = (accessToken: string): string | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    return decoded.role;
  } catch (error) {
    console.error("Failed to decode token role:", error);
    return null;
  }
};

export const readNameFromJwt = (accessToken: string): string | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    return decoded.sub;
  } catch (error) {
    console.error("Failed to decode token username:", error);
    return null;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) return null;

        const user = await res.json();
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === "object" && "accessToken" in user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};
