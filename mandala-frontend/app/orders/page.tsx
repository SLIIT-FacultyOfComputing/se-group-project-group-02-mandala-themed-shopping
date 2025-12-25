"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingBag, Clock, MapPin, AlertCircle, ArrowDownToLine, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    axios
      .get("/api/orders/user")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.orders || []
        setOrders(data)
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err)
        alert("Failed to fetch orders")
      })
      .finally(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      case "SHIPPED":
        return "bg-purple-100 text-purple-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="text-purple-600">Loading your spiritual journey...</p>
        </div>
      </div>
    )
  }

  if (!Array.isArray(orders)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden p-8 text-center max-w-md">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-purple-300" />
            </div>
            <h2 className="text-xl font-medium text-purple-800">Unexpected Response</h2>
            <p className="text-purple-600">We encountered an issue while loading your orders.</p>
            <Button className="mt-4" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
        <Link href="/products" className="inline-flex items-center text-purple-700 hover:text-purple-900 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Link>
        <div className="text-center relative py-6">
          <div className="flex items-center justify-center gap-2">
            <Package className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800">Your Orders</h1>
          </div>
          <p className="text-purple-600 mt-1">Track your spiritual journey with us</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <ShoppingBag className="h-12 w-12 text-purple-400" />
              <h2 className="text-xl font-medium text-purple-800">No Orders Yet</h2>
              <p className="text-purple-600 max-w-md mx-auto">
                Explore our collection of mandala art and spiritual items to find what resonates with your soul.
              </p>
              <Button asChild>
                <Link href="/shop">Discover Products</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-md group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-purple-800">Order #{order.orderNumber}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-purple-500 mt-0.5" />
                          <div>
                            <p className="text-purple-600">Placed On</p>
                            <p className="font-medium text-purple-800">
                              {new Date(order.orderDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        {order.shippingAddress && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-purple-500 mt-0.5" />
                            <div>
                              <p className="text-purple-600">Shipping Address</p>
                              <p className="font-medium text-purple-800">
                                {order.shippingAddress.street}, {order.shippingAddress.city}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-purple-600 text-sm">Total Amount</p>
                        <p className="text-xl font-bold text-purple-800">Rs. {Number(order.total).toLocaleString()}</p>
                      </div>

                      <Button
                        variant="outline"
                        className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 group-hover:border-purple-300 transition-colors"
                        onClick={async () => {
                          // Declare button variable outside try/catch
                          const button = document.getElementById(`receipt-btn-${order.id}`) as HTMLButtonElement;

                          try {
                            // Show loading state
                            if (button) {
                              button.innerHTML = '<span class="flex items-center gap-1"><span class="animate-spin">⟳</span> Downloading...</span>';
                              button.disabled = true;
                            }

                            console.log(`Downloading receipt for order ID: ${order.id}`);
                            
                            // Use axios to get the blob data with detailed logging and timeout
                            const response = await axios.get(`http://localhost:8080/api/receipts/download/${order.id}`, {
                              responseType: 'blob',
                              headers: {
                                'Accept': 'application/pdf'
                              },
                              timeout: 10000, // Set a reasonable timeout (10 seconds)
                              validateStatus: (status) => status === 200 // Only accept 200 status
                            });
                            
                            console.log('Response received:', {
                              status: response.status,
                              contentType: response.headers['content-type'],
                              contentLength: response.headers['content-length'],
                              dataSize: response.data?.size
                            });
                            
                            // Validate the response thoroughly
                            if (!response.data) {
                              throw new Error('Received empty response data');
                            }
                            
                            if (response.data.size === 0) {
                              console.error('Received zero-byte PDF data');
                              throw new Error('Received empty PDF file. Please try again or contact support.');
                            }
                            
                            // Verify we got a PDF
                            const contentType = response.headers['content-type'];
                            if (contentType !== 'application/pdf') {
                              console.error(`Expected PDF but received: ${contentType}`);
                              
                              // Try to read error message if it's text
                              if (contentType && contentType.includes('text')) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  console.error('Error response content:', reader.result);
                                };
                                reader.readAsText(response.data);
                              }
                              
                              // Continue anyway as browser might still handle it
                              console.warn('Attempting to process non-PDF response as PDF');
                            }
                            
                            // Create blob URL with explicit PDF MIME type
                            const blob = new Blob([response.data], { type: 'application/pdf' });
                            console.log(`Created blob with size: ${blob.size} bytes`);
                            
                            // Try to open the PDF in a new tab first
                            const url = window.URL.createObjectURL(blob);
                            
                            // Skip the iframe testing and use direct download
                            try {
                              // Create a direct download link
                              const filename = `receipt_order_${order.orderNumber}.pdf`;
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', filename);
                              link.setAttribute('target', '_blank');
                              document.body.appendChild(link);
                              
                              // Trigger download
                              link.click();
                              
                              // Clean up
                              link.parentNode?.removeChild(link);
                              setTimeout(() => window.URL.revokeObjectURL(url), 100);
                              
                              // Also try to open it in a new window as fallback
                              const pdfWindow = window.open(url, '_blank');
                              if (pdfWindow) {
                                pdfWindow.document.title = filename;
                              }
                              
                              console.log('Receipt download initiated successfully');
                            } catch (downloadError) {
                              console.error('Error during direct download:', downloadError);
                              
                              // Try direct URL approach as a final fallback
                              console.log('Trying direct URL approach');
                              window.open(`http://localhost:8080/api/receipts/download/${order.id}`, '_blank');
                            }
                            
                            // Reset button
                            if (button) {
                              button.innerHTML = '<span class="flex items-center gap-1">Download Receipt <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span>';
                              button.disabled = false;
                            }
                          } catch (error) {
                            console.error('Error downloading receipt:', error);
                            
                            // Try direct URL approach as a last resort
                            try {
                              console.log('Trying direct URL after error');
                              window.open(`http://localhost:8080/api/receipts/download/${order.id}`, '_blank');
                            } catch (directError) {
                              console.error('Direct URL failed:', directError);
                              alert('Failed to download receipt. Please try again later.');
                            }
                            
                            // Reset button on error
                            if (button) {
                              button.innerHTML = '<span class="flex items-center gap-1">Download Receipt <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span>';
                              button.disabled = false;
                            }
                          }
                        }}
                        id={`receipt-btn-${order.id}`}
                      >
                        <span className="flex items-center gap-1">
                          Download Receipt <ArrowDownToLine className="h-4 w-4" />
                        </span>
                      </Button>
                      
                      {/* Direct link as a second option */}
                      <div className="text-xs text-purple-500 mt-1">
                        <a 
                          href={`http://localhost:8080/api/receipts/download/${order.id}`}
                          target="_blank"
                          className="hover:underline"
                        >
                          Alternative download link
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
