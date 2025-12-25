"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { useSession } from 'next-auth/react'

export default function PaymentConfirmationPage() {
  const [status, setStatus] = useState<'processing' | 'succeeded' | 'failed'>('processing')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session || !searchParams) return;

    const payment_intent = searchParams.get('payment_intent')
    const payment_intent_client_secret = searchParams.get('payment_intent_client_secret')
    const redirect_status = searchParams.get('redirect_status')

    const fetchOrderDetailsAndCreateOrder = async () => {
      console.log("Fetching order details...");
      
      const orderDetails = {
          shippingAddress: JSON.parse(localStorage.getItem('tempShippingAddress') || '{}'),
          paymentMethod: "CREDIT_CARD",
          items: JSON.parse(localStorage.getItem('tempCartItems') || '[]')
      };
      
      if (!orderDetails.shippingAddress || orderDetails.items.length === 0) {
          console.error("Could not retrieve complete order details.");
          setStatus('failed');
          return;
      }

      console.log("Order details retrieved, calling backend API...");

      try {
        const token = session.accessToken;
        if (!token) {
            console.error("Session token not available.");
            setStatus('failed');
            return;
        }

        const res = await fetch("http://localhost:8080/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderDetails),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Backend error response:', errorText);
          throw new Error(`Backend error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        console.log("Order created successfully:", data);

        localStorage.setItem("orderSummary", JSON.stringify(data));
        localStorage.removeItem('tempShippingAddress');
        localStorage.removeItem('tempCartItems');
        localStorage.removeItem("cartItems");

        setStatus('succeeded');
        router.push("/orders");

      } catch (err: any) {
        console.error('Error creating order after payment:', err);
        setStatus('failed');
      }
    };

    if (redirect_status === 'succeeded') {
      setStatus('processing');
      fetchOrderDetailsAndCreateOrder();
    } else if (payment_intent || payment_intent_client_secret) {
        setStatus('failed');
    }
    else {
      console.error("Not a Stripe redirect or payment failed.");
      setStatus('failed');
    }
  }, [searchParams, router, session])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200">
      <div className="max-w-7xl mx-auto p-8">
        <Card className="bg-white/80 backdrop-blur-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              {status === 'processing' && (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                  <h2 className="text-2xl font-semibold text-purple-800">Processing Payment</h2>
                  <p className="text-purple-600">Please wait while we confirm your payment...</p>
                </>
              )}

              {status === 'succeeded' && (
                <>
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-purple-800">Payment Successful!</h2>
                  <p className="text-purple-600">Thank you for your purchase. Your order has been confirmed.</p>
                  <Button
                    onClick={() => router.push('/orders')}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm hover:shadow transition-all"
                  >
                    View Orders
                  </Button>
                </>
              )}

              {status === 'failed' && (
                <>
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-purple-800">Payment Failed</h2>
                  <p className="text-purple-600">There was an issue processing your payment. Please try again.</p>
                  <Button
                    onClick={() => router.push('/checkout')}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm hover:shadow transition-all"
                  >
                    Return to Checkout
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 