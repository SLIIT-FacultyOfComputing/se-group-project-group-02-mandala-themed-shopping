"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden">
      {/* Live Animated Background */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-purple-200 via-indigo-100 to-pink-200 z-0" />

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Section: Text Content */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Mindful Products <br />
            for a Mandala Life
          </h1>
          <p className="text-xl text-gray-600 max-w-md">
            Discover beautiful, customizable pieces crafted to bring peace, balance, and harmony into your everyday life.
          </p>
          <div className="flex gap-4 mt-6">
            <Button
              className="px-6 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md"
              onClick={() => router.push("/login")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 text-lg border-gray-300 hover:border-purple-600 hover:text-purple-700 rounded-full"
            >
              Explore
            </Button>
          </div>
        </div>

        {/* Right Section: Visual or Screenshot */}
        <div className="relative w-full h-[100px] md:h-[500px]">
          <Image
            src="/blacktt.png" // Make sure this exists in /public
            alt="Mandala Preview"
            fill
            className="object-contain rounded-xl shadow-xl"
          />
        </div>
      </div>
    </main>
  );
}
