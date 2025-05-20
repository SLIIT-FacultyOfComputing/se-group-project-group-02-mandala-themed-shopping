"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, CreditCard, Truck, ShieldCheck, DollarSign, ChevronsRight, ArrowLeft } from "lucide-react"
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '@/lib/stripe';
import Link from "next/link"

interface StripePaymentFormProps {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  address,
  loading,
  setLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleCreditCardSubmit = async () => {
    setLoading(true);
    try {
      if (!stripe || !elements) throw new Error('Stripe failed to initialize');

      // Save order details to local storage before redirecting to Stripe
      localStorage.setItem('tempShippingAddress', JSON.stringify(address));
      const cartItems = localStorage.getItem("cartItems");
      if (cartItems) {
        localStorage.setItem('tempCartItems', cartItems);
      }
      console.log("Checkout: Saved order details to local storage."); // Added log

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
        },
      });

      if (error) {
        throw error;
      }
      // If confirmPayment succeeds, the redirect happens automatically via return_url
      // The confirmation page (which is now /orders due to return_url) will handle order creation based on local storage data.

    } catch (error: any) {
      console.error('Payment failed:', error);
      // Handle error appropriately, maybe set a failed status message on the checkout page
    } finally {
      setLoading(false);
    }
  };

  if (!stripe || !elements) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <PaymentElement />
      <Button
        type="button"
        onClick={handleCreditCardSubmit}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm hover:shadow transition-all"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 group">
            <span>Pay Now</span>
            <ChevronsRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </Button>
    </div>
  );
};

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
  const [clientSecret, setClientSecret] = useState<string>('')

  useEffect(() => {
    if (paymentMethod === 'CREDIT_CARD') {
      // Replace with your actual order total
      const amount = 1000; // Example amount in dollars
      
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
        });
    }
  }, [paymentMethod]);

  const handleChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'CREDIT_CARD') return; // Stripe handles this

    setLoading(true);
    try {
      const token = session?.accessToken;
      if (!token) {
        alert("You must be logged in to place an order.");
        return;
      }

      const cartItems = localStorage.getItem("cartItems");
      if (!cartItems) {
        alert("Cart is empty.");
        return;
      }

      const orderPayload = {
        shippingAddress: address,
        paymentMethod,
        items: JSON.parse(cartItems),
      };

      const res = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();

      // Save locally
      localStorage.setItem("orderSummary", JSON.stringify(data));
      localStorage.removeItem("cartItems");

      // Redirect to orders page
      router.push("/orders");
    } catch (err) {
      alert("Order submission failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200">
      <div className="max-w-7xl mx-auto p-8">
        <Link href="/cart" className="inline-flex items-center text-purple-700 hover:text-purple-900 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>
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

        <Card className="bg-white/80 backdrop-blur-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Address Section */}
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
                    <Label htmlFor="street" className="font-medium text-purple-600">
                      Street Address
                    </Label>
                    <Input
                      id="street"
                      required
                      value={address.street}
                      onChange={(e) => handleChange("street", e.target.value)}
                      className="border-purple-200 focus-visible:ring-purple-400 rounded-xl shadow-sm"
                      placeholder="123 Mandala Lane"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="font-medium text-purple-600">
                      City
                    </Label>
                    <Input
                      id="city"
                      required
                      value={address.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="border-purple-200 focus-visible:ring-purple-400 rounded-xl shadow-sm"
                      placeholder="Mandala City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="font-medium text-purple-600">
                      State
                    </Label>
                    <Input
                      id="state"
                      required
                      value={address.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      className="border-purple-200 focus-visible:ring-purple-400 rounded-xl shadow-sm"
                      placeholder="Mandala State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="font-medium text-purple-600">
                      Zip Code
                    </Label>
                    <Input
                      id="zipCode"
                      required
                      value={address.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      className="border-purple-200 focus-visible:ring-purple-400 rounded-xl shadow-sm"
                      placeholder="12345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="font-medium text-purple-600">
                      Country
                    </Label>
                    <Input
                      id="country"
                      required
                      value={address.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="border-purple-200 focus-visible:ring-purple-400 rounded-xl shadow-sm"
                      placeholder="Mandala Land"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-purple-800">Payment Method</h3>
                </div>
                <Separator className="mb-6 bg-purple-100" />

                <div className="space-y-4">
                  <Label htmlFor="payment-method" className="font-medium text-purple-600">
                    Select Payment Method
                  </Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="w-full border-purple-200 focus:ring-purple-400 rounded-xl bg-white shadow-sm">
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
                {paymentMethod === 'CREDIT_CARD' ? (
                  clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripePaymentForm address={address} loading={loading} setLoading={setLoading} />
                    </Elements>
                  ) : (
                    <div>Loading payment form...</div>
                  )
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm hover:shadow transition-all"
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
                )}
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
    </div>
  )
}
