"use client"

import { useEffect, useState } from "react"
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface WishlistItem {
  productId: number
  name: string
  price: number
  image: string
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("wishlist")
    if (stored) {
      setWishlist(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const removeFromWishlist = (productId: number) => {
    const updated = wishlist.filter((item) => item.productId !== productId)
    setWishlist(updated)
    localStorage.setItem("wishlist", JSON.stringify(updated))
  }

  const addToCart = (productId: number) => {
    const cart = JSON.parse(localStorage.getItem("cartItems") || "[]")
    cart.push({ productId, quantity: 1 })
    localStorage.setItem("cartItems", JSON.stringify(cart))

    // Show toast notification instead of alert
    const toast = document.createElement("div")
    toast.className =
      "fixed bottom-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-up"
    toast.textContent = "Added to cart"
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.add("animate-fade-out")
      setTimeout(() => document.body.removeChild(toast), 500)
    }, 2000)
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
            <Heart className="h-6 w-6 text-purple-600 fill-purple-200" />
            <h1 className="text-3xl font-bold text-purple-800">Your Wishlist</h1>
          </div>
          <p className="text-purple-600 mt-1">Items you've saved for your spiritual journey</p>
        </div>

        <Link href="/products" className="inline-flex items-center text-purple-700 hover:text-purple-900 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden p-12 text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
            <div className="flex flex-col items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center">
                <Heart className="h-12 w-12 text-purple-300" />
              </div>
              <h2 className="text-xl font-medium text-purple-800">Your wishlist is empty</h2>
              <p className="text-purple-600 max-w-md mx-auto">
                Explore our collection of mandala art and spiritual items to find pieces that resonate with your soul
              </p>
              <Button
                className="mt-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-full px-8 py-6 text-white"
                asChild
              >
                <Link href="/shop">Discover Products</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wishlist.map((item) => (
              <Card
                key={item.productId}
                className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 aspect-square">
                    <img
                      src={item.image || "/placeholder.svg?height=200&width=200"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                  </div>
                  <div className="p-6 flex flex-col justify-between w-full md:w-2/3">
                    <div>
                      <h2 className="text-xl font-semibold text-purple-800 group-hover:text-purple-900 transition-colors">
                        {item.name}
                      </h2>
                      <div className="mt-2 flex items-center">
                        <span className="text-lg font-medium text-purple-700">{item.price.toLocaleString()} LKR</span>
                        <div className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          In Stock
                        </div>
                      </div>
                      <Separator className="my-4 bg-purple-100" />
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <Button
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-xl gap-2 text-white"
                        onClick={() => addToCart(item.productId)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl"
                        onClick={() => removeFromWishlist(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        
        .animate-fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }
      `}</style>

      <div className="h-16 w-full bg-gradient-to-t from-purple-100 to-transparent"></div>
    </div>
  )
}
