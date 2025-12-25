"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  LayoutGrid,
  LogOut,
  User,
} from "lucide-react";

const links = [
  { href: "/products", label: "Products", icon: LayoutGrid },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/settings", label: "Profile", icon: User }, // ✅ ADDED THIS
];

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside
        className={`bg-white shadow-lg transition-all duration-300 flex flex-col justify-between ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Top Part */}
        <div className="p-4">
          <button
            className="mb-6 text-purple-600 hover:text-purple-800"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
          </button>

          <nav className="space-y-2">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-100 ${
                  pathname === href
                    ? "bg-purple-100 text-purple-800 font-semibold"
                    : "text-gray-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom (Sign Out) */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 hover:text-red-800 px-2 py-2 w-full"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gradient-to-b from-purple-50 via-white to-purple-100">
        {children}
      </main>
    </div>
  );
}
