"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Heart,
  Search,
  Filter,
  ArrowDownWideNarrow,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  customizable: boolean;
  images: string[];
}

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  // UI filters
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");

  useEffect(() => {
    if (session?.accessToken) fetchProducts();
  }, [session?.accessToken]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading products", err);
    }
  };

  const filtered = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) => (category === "all" ? true : p.category === category))
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return 0;
    });

  const handleAddToCart = async (productId: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      alert("Added to cart");
    } catch  {
      alert("Error adding to cart");
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Failed to add to wishlist");
      alert("Added to wishlist");
    } catch  {
      alert("Error adding to wishlist");
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200">
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            Browse Our Mandala Collection
          </h1>
          <p className="text-purple-600">Use search and filters to explore</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-3 h-4 w-10 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 flex-1 min-w-[250px]">
            <div className="relative w-full">
              <Filter className="absolute left-3 top-3 h-4 w- text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none pl-10 pr-6 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">All Categories</option>
                <option value="Clothes">Clothes</option>
                <option value="Accessories">Accessories</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Decor">Decor</option>
              </select>
            </div>

            <div className="relative">
              <ArrowDownWideNarrow className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-10 pr-6 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Sort by</option>
                <option value="price_asc">Price Low to High</option>
                <option value="price_desc">Price High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => (
            <Card
              key={product.id}
              className="bg-white/80 backdrop-blur-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images[0] || "/placeholder.svg"}
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
                  {product.stockQuantity > 10
                    ? "In Stock"
                    : `Only ${product.stockQuantity} left`}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                </Button>
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white"
                  onClick={() => handleAddToWishlist(product.id)}
                >
                  <Heart className="h-4 w-4 mr-2" /> Wishlist
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
