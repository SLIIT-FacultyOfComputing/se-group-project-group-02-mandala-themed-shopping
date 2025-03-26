"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ArrowUpDown,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const products = [
    {
      id: 1,
      name: "Mandala White T Shirt",
      price: 2000.0,
      stock: 25,
      category: "Shirt",
      description: "Mandala Themed White T shirt",
      image: "/whiteT.jpg",
    },
    {
      id: 2,
      name: "Mandala Black T Shirt",
      price: 2000.0,
      stock: 15,
      category: "Decor",
      description: "Hand-painted sacred geometry mandala wall hanging",
      image: "/blackt.jpg",
    },
    {
      id: 3,
      name: "Mandala Birthday Cards",
      price: 200.0,
      stock: 30,
      category: "Spiritual",
      description: "Collection of 7 chakra healing crystals with guide",
      image: "/birthcard.jpg",
    },
    {
      id: 4,
      name: "Mandala Relaxing Book",
      price: 89.99,
      stock: 20,
      category: "Instruments",
      description: "Traditional hand-hammered meditation singing bowl",
      image: "/relaxb.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200">
      <div className="max-w-7xl mx-auto p-8">
        {/* 🔐 Top Bar with Logout */}
        <div className="flex justify-end mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-purple-700 hover:bg-purple-100 flex items-center gap-2"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">Mandala Collection</h1>
          <p className="text-purple-600">Discover our curated selection of Mandala items</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-md mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter by Category
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" /> Sort by Price
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-white/80 backdrop-blur-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold text-purple-800">
                      {product.name}
                    </CardTitle>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-purple-800">
                    {product.price} LKR
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{product.description}</p>
                <p className="mt-2 text-sm text-purple-600">
                  {product.stock > 10 ? "In Stock" : `Only ${product.stock} left`}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
