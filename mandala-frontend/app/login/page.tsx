"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (res?.ok) {
        router.push("/dashboard");
      } else {
        setError("Invalid login credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = (document.getElementById("reg-username") as HTMLInputElement).value;
    const email = (document.getElementById("reg-email") as HTMLInputElement).value;
    const password = (document.getElementById("reg-password") as HTMLInputElement).value;
    const firstName = (document.getElementById("reg-firstname") as HTMLInputElement).value;
    const lastName = (document.getElementById("reg-lastname") as HTMLInputElement).value;
    const phoneNumber = (document.getElementById("reg-phone") as HTMLInputElement).value;

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, firstName, lastName, phoneNumber ,
          role: "USER",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please log in.");
        setIsRegistering(false);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/BG.png')" }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0" />

      <Link
        href="/"
        className="absolute left-6 top-6 md:left-12 md:top-12 flex items-center gap-3 z-10"
      >
        <span className="text-lg font-semibold text-gray-900">MandalaMarket</span>
      </Link>

      <div className="relative z-10 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-3 text-center">
          <h1 className="text-3xl font-bold text-purple-900">Welcome to MandalaMarket</h1>
          <p className="text-md text-purple-700">Discover our beautiful collection of mandala products</p>
        </div>

        {!showLogin ? (
          <Card className="shadow-lg border border-gray-200 bg-white">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-center text-gray-900 font-semibold">
                Choose an Option
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Continue as a guest or sign in as a member
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <Button
                className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 text-lg font-medium"
                onClick={() => router.push("/products")}
              >
                Explore as Guest
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-white px-3 text-gray-600">OR</span>
                </div>
              </div>
              <Button
                className="w-full border-gray-300 hover:border-gray-400 text-gray-900 py-2.5 text-lg font-medium"
                onClick={() => setShowLogin(true)}
              >
                Be a Member
              </Button>
            </CardContent>
          </Card>
        ) : isRegistering ? (
          <Card className="shadow-lg border border-gray-200 bg-white">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-center text-gray-900 font-semibold">
                Create an Account
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <form onSubmit={handleMemberRegister} className="grid gap-4">
                <Input id="reg-username" placeholder="Username" required />
                <Input id="reg-email" type="email" placeholder="Email" required />
                <Input id="reg-password" type="password" placeholder="Password" required />
                <Input id="reg-firstname" placeholder="First Name" required />
                <Input id="reg-lastname" placeholder="Last Name" required />
                <Input id="reg-phone" placeholder="Phone Number" required />
                <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                <Button variant="outline" onClick={() => setIsRegistering(false)}>
                  Back to Login
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border border-gray-200 bg-white">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-center text-gray-900 font-semibold">
                Member Login
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <form onSubmit={handleMemberLogin} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" placeholder="Enter username" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" required />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 text-lg font-medium"
                >
                  {loading ? "Logging in..." : "Sign In"}
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-white px-3 text-gray-600">OR</span>
                </div>
              </div>
              <Button
                className="w-full border-gray-300 hover:border-gray-400 text-gray-900 py-2.5 text-lg font-medium"
                onClick={() => setIsRegistering(true)}
              >
                Create an Account
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLogin(false)}
              >
                Back to Options
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
