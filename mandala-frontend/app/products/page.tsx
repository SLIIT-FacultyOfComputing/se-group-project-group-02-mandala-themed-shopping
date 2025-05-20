"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // ✅ ADDED
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { addToCart } from "@/app/cart/utils/cartUtils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("none");

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let updated = [...products];

    if (category !== "All") {
      updated = updated.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sort === "low") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      updated.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updated);
  }, [products, searchTerm, category, sort]);

  const handleAddToCart = (productId: number) => {
    addToCart(productId, 1);
    alert("Item added to cart!");
  };

  const handleAddToWishlist = (product: Product) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exists = wishlist.find((item: any) => item.productId === product.id);

    if (!exists) {
      wishlist.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
      });
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("Added to wishlist");
    } else {
      alert("Already in wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200">
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            Browse Our Mandala Collection
          </h1>
          <p className="text-purple-600">
            Discover beautiful Mandala-themed items.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60 bg-white shadow-sm"
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48 bg-white shadow-sm">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
              <SelectItem value="Clothes">Clothes</SelectItem>
              <SelectItem value="Cards">Cards</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-48 bg-white shadow-sm">
              <SelectValue placeholder="Sort by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Default</SelectItem>
              <SelectItem value="low">Price: Low to High</SelectItem>
              <SelectItem value="high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="bg-white/80 backdrop-blur-md hover:shadow-lg transition-shadow hover:cursor-pointer">
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
                      <span className="mt-2 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
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
                    onClick={(e) => {
                      e.preventDefault(); // prevent navigation on click
                      handleAddToCart(product.id);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                  </Button>
                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white"
                    onClick={(e) => {
                      e.preventDefault(); // prevent navigation on click
                      handleAddToWishlist(product);
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" /> Wishlist
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
