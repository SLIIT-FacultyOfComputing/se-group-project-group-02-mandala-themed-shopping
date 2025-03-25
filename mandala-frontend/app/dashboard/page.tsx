"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  History,
  Settings,
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white/80 backdrop-blur-md p-6 border-r border-purple-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mandala_1.svg/1024px-Mandala_1.svg.png"
                alt="Logo"
                className="w-10 h-10"
              />
              <h2 className="text-xl font-bold text-purple-800">Admin Portal</h2>
            </div>

            <nav className="space-y-2">
              <Link href="/dashboard/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-purple-700">
                <Package size={20} />
                <span>Products</span>
              </Link>
              <Link href="/dashboard/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-purple-700">
                <ShoppingCart size={20} />
                <span>Orders</span>
              </Link>
              <Link href="/dashboard/history" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-purple-700">
                <History size={20} />
                <span>Order History</span>
              </Link>
              <Link href="/dashboard/customers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-purple-700">
                <Users size={20} />
                <span>Customers</span>
              </Link>
              <Link href="/dashboard/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-purple-700">
                <BarChart3 size={20} />
                <span>Analytics</span>
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-purple-700">
                <Settings size={20} />
                <span>Settings</span>
              </Link>
            </nav>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
          >
            🚪 Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-purple-800">Welcome back, {session?.user?.name}</h1>
                <p className="text-purple-600 mt-1">Manage your store with peace and harmony</p>
              </div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mandala_1.svg/1024px-Mandala_1.svg.png"
                alt="Mandala"
                className="w-20 h-20 opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle>Total Products</CardTitle>
                  <CardDescription>Active listings in your store</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-800">24</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle>Pending Orders</CardTitle>
                  <CardDescription>Orders awaiting processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-800">12</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>This month's earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-800">$2,450</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
