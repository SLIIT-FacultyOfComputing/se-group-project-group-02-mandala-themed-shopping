"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, CreditCard, Truck, ShieldCheck, DollarSign, ChevronsRight } from "lucide-react"

export default function CheckoutWithPaymentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD")
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = session?.accessToken
      if (!token) {
        alert("You must be logged in to place an order.")
        return
      }

      const cartItems = localStorage.getItem("cartItems")
      if (!cartItems) {
        alert("Cart is empty.")
        return
      }

      const orderPayload = {
        shippingAddress: address,
        paymentMethod,
        items: JSON.parse(cartItems),
      }

      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      const data = await res.json()

      // ✅ Save locally
      localStorage.setItem("orderSummary", JSON.stringify(data))
      localStorage.removeItem("cartItems")

      alert("Order placed successfully!")

      // ✅ Download receipt
      if (data.receiptDownloadUrl) {
        const link = document.createElement("a")
        link.href = data.receiptDownloadUrl
        link.download = `receipt_${data.id}.pdf`
        link.click()
      }

      router.push("/orders")
    } catch (err) {
      alert("Order submission failed.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="text-purple-600">Loading your checkout...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-3xl mx-auto py-10 px-6 space-y-8">
        <div className="text-center relative py-6">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-contain bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%239333ea" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm0-200c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm0-320c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm0 80c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z"></path></svg>\')',
            }}
          ></div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800">Complete Your Order</h1>
          </div>
          <p className="text-purple-600 mt-1">Shipping details and payment information</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs text-purple-600 mt-1">Shipping</p>
          </div>
          <div className="w-12 h-px bg-purple-200 self-center"></div>
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs text-purple-600 mt-1">Payment</p>
          </div>
          <div className="w-12 h-px bg-purple-200 self-center"></div>
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs text-purple-600 mt-1">Confirmation</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-purple-800">Shipping Address</h3>
                </div>
                <Separator className="mb-6 bg-purple-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street" className="font-medium text-purple-700">
                      Street Address
                    </Label>
                    <Input
                      id="street"
                      required
                      value={address.street}
                      onChange={(e) => handleChange("street", e.target.value)}
                      className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                      placeholder="123 Mandala Lane"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="font-medium text-purple-700">
                      City
                    </Label>
                    <Input
                      id="city"
                      required
                      value={address.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                      placeholder="Serenity City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="font-medium text-purple-700">
                      State/Province
                    </Label>
                    <Input
                      id="state"
                      required
                      value={address.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                      placeholder="Harmony State"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="font-medium text-purple-700">
                      ZIP/Postal Code
                    </Label>
                    <Input
                      id="zipCode"
                      required
                      value={address.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                      placeholder="12345"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="font-medium text-purple-700">
                      Country
                    </Label>
                    <Input
                      id="country"
                      required
                      value={address.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                      placeholder="Mandala Land"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-purple-800">Payment Method</h3>
                </div>
                <Separator className="mb-6 bg-purple-100" />

                <div className="space-y-4">
                  <Label htmlFor="payment-method" className="font-medium text-purple-700">
                    Select Payment Method
                  </Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="w-full border-purple-200 focus:ring-purple-400 rounded-xl bg-white">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CREDIT_CARD" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-purple-600" />
                          <span>Credit Card</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="PAYPAL">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-purple-600" />
                          <span>PayPal</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="CASH_ON_DELIVERY">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-purple-600" />
                          <span>Cash on Delivery</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-purple-500">Your payment information is encrypted and secure</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-full py-6 text-white shadow-md hover:shadow-lg transition-all text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 group">
                      <span>Complete Order</span>
                      <ChevronsRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-purple-600 mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <p>Your information is protected with secure encryption</p>
          </div>
        </div>
      </div>

      <div className="h-16 w-full bg-gradient-to-t from-purple-100 to-transparent"></div>
    </div>
  )
}
