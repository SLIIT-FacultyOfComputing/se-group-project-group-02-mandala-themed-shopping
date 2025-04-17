"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
}

interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    const parsed: CartItem[] = stored ? JSON.parse(stored) : [];
    setCartItems(parsed);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const enrichedCart = cartItems.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }));

  const totalPrice = enrichedCart.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleRemove = (productId: number) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-purple-800 text-center">
          Your Cart
        </h1>

        {enrichedCart.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {enrichedCart.map((item) => (
              <Card key={item.productId} className="flex flex-col md:flex-row">
                <div className="w-full md:w-40 h-40 overflow-hidden">
                  <img
                    src={item.product?.images?.[0] || "/placeholder.svg"}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 space-y-2">
                  <CardTitle className="text-xl text-purple-900">
                    {item.product?.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-purple-700 font-semibold">
                    Price: {item.product?.price} LKR
                  </p>
                </div>
                <CardFooter className="justify-end">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemove(item.productId)}
                  >
                    <Trash2 />
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* Summary Section */}
            <Card className="bg-white/70 p-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-purple-800">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-800">
                <p>Total Items: {enrichedCart.length}</p>
                <p className="text-lg font-bold">Total Price: {totalPrice} LKR</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
