"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
  Star,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { addToCart } from "@/app/cart/utils/cartUtils"; // ✅ Use existing cart utils

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  customizable: boolean;
  images: string[];
  sizes: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize && product?.sizes?.length) {
      alert("Please select a size");
      return;
    }

    addToCart(product!.id, 1); // ✅ Uses your cartUtils as-is
    alert(`Added ${product?.name} (Size: ${selectedSize}) to cart`);
  };

  const addToWishlist = () => {
    if (!product) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    const exists = wishlist.find(
      (item: any) => item.productId === product.id && item.size === selectedSize
    );

    if (!exists) {
      wishlist.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        size: selectedSize,
      });

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert(`Added ${product.name} to wishlist`);
    } else {
      alert("Already in wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="text-purple-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden p-8 text-center max-w-md">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-purple-300" />
            </div>
            <h2 className="text-xl font-medium text-purple-800">Product Not Found</h2>
            <p className="text-purple-600">
              We couldn't find the product you're looking for.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-full px-8 py-6 text-white"
              asChild
            >
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const formatDescription = (description: string) => {
    if (!description) return "";

    const parts = description.split("Key Features:");

    if (parts.length === 1) {
      return <p className="text-purple-700 leading-relaxed">{description}</p>;
    }

    return (
      <>
        <p className="text-purple-700 leading-relaxed mb-4">{parts[0].trim()}</p>
        <h4 className="font-medium text-purple-800 mb-2">Key Features:</h4>
        <ul className="list-disc pl-5 space-y-1 text-purple-700">
          {parts[1]
            .split(".")
            .filter((item) => item.trim().length > 0)
            .map((feature, index) => (
              <li key={index}>{feature.trim()}</li>
            ))}
        </ul>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto py-10 px-6">
        <Link
          href="/products"
          className="inline-flex items-center text-purple-700 hover:text-purple-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images?.[selectedImage] || "/placeholder.svg?height=600&width=600"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-purple-500" : "border-transparent"
                    } transition-all`}
                  >
                    <div className="w-20 h-20">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-1 text-sm rounded-full">
                  {product.category}
                </Badge>
                {product.stockQuantity > 0 ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 text-sm rounded-full">
                    In Stock
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 text-sm rounded-full">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mt-3">{product.name}</h1>

              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5"
                    fill={star <= 4 ? "#9333ea" : "none"}
                    stroke={star <= 4 ? "#9333ea" : "#9333ea"}
                  />
                ))}
                <span className="text-sm text-purple-600 ml-2">4.0 (24 reviews)</span>
              </div>

              <div className="mt-6">
                <p className="text-3xl font-bold text-purple-900">{product.price.toLocaleString()} LKR</p>
              </div>
            </div>

            <Separator className="bg-purple-100" />

            <div className="space-y-4">
              <div className="prose prose-purple max-w-none">{formatDescription(product.description)}</div>
            </div>

            <Separator className="bg-purple-100" />

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <label className="block font-medium text-purple-800">Select Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full md:w-64 border-purple-200 focus:ring-purple-400 rounded-xl bg-white">
                    <SelectValue placeholder="Choose a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-xl gap-2 text-white py-6"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl gap-2"
                onClick={addToWishlist}
              >
                <Heart className="h-5 w-5" /> Add to Wishlist
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                <Truck className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Free Shipping</p>
                  <p className="text-xs text-purple-600">On orders over 5000 LKR</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                <Shield className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Secure Payment</p>
                  <p className="text-xs text-purple-600">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                <RefreshCw className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Easy Returns</p>
                  <p className="text-xs text-purple-600">30 day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 w-full bg-gradient-to-t from-purple-100 to-transparent"></div>
    </div>
  );
}
