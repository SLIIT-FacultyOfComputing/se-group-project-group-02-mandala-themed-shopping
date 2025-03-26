"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="w-full bg-purple-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold">MandalaMarket</h1>
      <Button onClick={handleLogout} className="bg-white text-purple-700 hover:bg-gray-100 font-medium">
        Logout
      </Button>
    </nav>
  );
}
