"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Trash2, ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  images: string[]
}

interface CartItem {
  productId: number
  quantity: number
  product?: Product
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Get cart items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cartItems")
    const parsed: CartItem[] = stored ? JSON.parse(stored) : []
    setCartItems(parsed)
  }, [])

  // Fetch product details
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/products")
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error("Product fetch failed:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const enrichedCart = cartItems.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }))

  const totalPrice = enrichedCart.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)
  const totalItems = enrichedCart.reduce((total, item) => total + item.quantity, 0)
  
  // Define shipping cost constant
  const shippingCost = 300
  
  // Calculate final total including shipping
  const finalTotal = totalPrice + shippingCost

  const handleRemove = (productId: number) => {
    const updated = cartItems.filter((item) => item.productId !== productId)
    setCartItems(updated)
    localStorage.setItem("cartItems", JSON.stringify(updated))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const updated = cartItems.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item))
    setCartItems(updated)
    localStorage.setItem("cartItems", JSON.stringify(updated))
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center relative py-6">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-contain bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%239333ea" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm0-200c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm0-320c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm0 80c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z"></path></svg>\')',
            }}
          ></div>
          <div className="flex items-center justify-center gap-2">
            <ShoppingBag className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800">Your Cart</h1>
          </div>
          <p className="text-purple-600 mt-1">Review your items before proceeding to checkout</p>
        </div>

        <Link href="/products" className="inline-flex items-center text-purple-700 hover:text-purple-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="text-purple-600">Loading your cart...</p>
          </div>
        ) : enrichedCart.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden p-12 text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
            <div className="flex flex-col items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-purple-300" />
              </div>
              <h2 className="text-xl font-medium text-purple-800">Your cart is empty</h2>
              <p className="text-purple-600 max-w-md mx-auto">
                Explore our collection of mandala art and spiritual items to find pieces that resonate with your soul
              </p>
              <Button
                className="mt-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-full px-8 py-6 text-white"
                asChild
              >
                <Link href="/products">Discover Products</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {enrichedCart.map((item) => (
                <Card
                  key={item.productId}
                  className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-40 h-40 overflow-hidden">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.svg?height=200&width=200"}
                        alt={item.product?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-purple-800 group-hover:text-purple-900 transition-colors">
                          {item.product?.name || "Unknown Product"}
                        </h3>
                        <p className="text-purple-700 font-medium mt-2">
                          {item.product ? `${item.product.price.toLocaleString()} LKR` : "Price unavailable"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-purple-200 rounded-full overflow-hidden">
                          <button
                            className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 font-medium text-purple-800">{item.quantity}</span>
                          <button
                            className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-red-600 transition-colors"
                          onClick={() => handleRemove(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden sticky top-6">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold text-purple-800">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-600">Items ({totalItems})</span>
                      <span className="font-medium text-purple-800">{totalPrice.toLocaleString()} LKR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-600">Shipping</span>
                      <span className="font-medium text-purple-800">{shippingCost.toLocaleString()} LKR</span>
                    </div>
                  </div>

                  <Separator className="bg-purple-100" />

                  <div className="flex justify-between">
                    <span className="font-medium text-purple-800">Total</span>
                    <span className="font-bold text-lg text-purple-900">{finalTotal.toLocaleString()} LKR</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-full py-6 text-white shadow-md hover:shadow-lg transition-all"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>

      <div className="h-16 w-full bg-gradient-to-t from-purple-100 to-transparent"></div>
    </div>
  )
}
