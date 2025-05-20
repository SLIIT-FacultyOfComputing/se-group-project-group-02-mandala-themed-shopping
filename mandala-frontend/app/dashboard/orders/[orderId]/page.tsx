"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Package, User, MapPin, DollarSign, Calendar, ShoppingBag, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: string;
  total: number;
  username: string;
  email: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    productId: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      images: string[];
    };
  }>;
}

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "SHIPPED":
      return "bg-purple-100 text-purple-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AdminOrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;

  if (!orderId) {
    router.push('/dashboard/orders');
    return null;
  }

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const availableStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  useEffect(() => {
    const fetchOrder = async () => {
      if (!session?.accessToken || !orderId) return;
      setLoading(true);

      try {
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            toast.error("Order not found.");
            router.push("/dashboard/orders");
          } else {
            throw new Error("Failed to fetch order");
          }
        }

        const data = await res.json();
        setOrder(data);
        setSelectedStatus(data.status);
      } catch (err) {
        console.error("Failed to load order details", err);
        toast.error("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken && orderId) {
      fetchOrder();
    }
  }, [session?.accessToken, orderId, router]);

  const handleStatusUpdate = async () => {
    if (!session?.accessToken || !order || !selectedStatus) return;
    setIsUpdatingStatus(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order status");

      toast.success("Order status updated successfully!");
      // Optionally refetch the order to show the updated status immediately
      // fetchOrder(); // This might cause a flicker, consider updating state directly
      setOrder(prevOrder => prevOrder ? { ...prevOrder, status: selectedStatus } : null);

    } catch (err) {
      console.error("Failed to update order status", err);
      toast.error("Failed to update order status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="text-purple-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden max-w-md text-center p-8">
          <CardContent className="flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-purple-800">Order Not Found</h2>
            <p className="text-purple-600">The requested order could not be loaded.</p>
            <Button onClick={() => router.push("/dashboard/orders")}>Back to Orders List</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-purple-800">Order #{order.orderNumber}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details Card */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-800">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-purple-600">Order Date</p>
                    <p className="font-medium text-purple-800">
                      {new Date(order.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-purple-600">Total Amount</p>
                    <p className="font-medium text-purple-800">{order.total.toLocaleString()} LKR</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 md:col-span-2">
                  <User className="h-4 w-4 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-purple-600">Customer</p>
                    <p className="font-medium text-purple-800">{order.username}</p>
                    <p className="text-purple-600 text-xs">{order.email}</p>
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="flex items-start gap-2 md:col-span-2">
                    <MapPin className="h-4 w-4 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-purple-600">Shipping Address</p>
                      <p className="font-medium text-purple-800">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="bg-purple-100" />

              {/* Order Items List */}
              <div>
                <h4 className="text-lg font-semibold text-purple-800 mb-4">Items</h4>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4 text-sm">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.svg"}
                        alt={item.product?.name || "Product"}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-purple-800">{item.product?.name || "Unknown Product"}</p>
                        <p className="text-purple-600 text-xs">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-purple-800">{item.product ? `${(item.product.price * item.quantity).toLocaleString()} LKR` : "Price unavailable"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Update Card */}
          <Card className="lg:col-span-1 bg-white/80 backdrop-blur-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden sticky top-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-800">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="font-medium text-purple-600">Current Status</Label>
                <p className={`font-semibold ${getStatusColor(order.status)} px-3 py-1 rounded-full inline-block`}>
                  {order.status}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-status" className="font-medium text-purple-600">Change Status To</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full border-purple-200 focus:ring-purple-400 rounded-xl bg-white shadow-sm">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map(statusOption => (
                      <SelectItem key={statusOption} value={statusOption}>
                        {statusOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleStatusUpdate}
                disabled={selectedStatus === order.status || isUpdatingStatus}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm hover:shadow transition-all"
              >
                {isUpdatingStatus ? 'Updating...' : 'Save Status'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 