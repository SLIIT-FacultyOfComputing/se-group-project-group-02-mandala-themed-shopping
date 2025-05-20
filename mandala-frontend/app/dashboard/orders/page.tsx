"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, User, MapPin, DollarSign, Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Order {
  id: number
  orderNumber: string
  orderDate: string
  status: string
  total: number
  username: string
  email: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.accessToken) return
      setLoading(true)

      try {
        const res = await fetch("/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        })

        const data = await res.json()

        if (Array.isArray(data)) {
          setOrders(data)
        } else {
          console.error("Invalid response format:", data)
          setOrders([])
        }
      } catch (err) {
        console.error("Failed to load admin orders", err)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [session?.accessToken])

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === null || order.status.toUpperCase() === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  const uniqueStatuses = Array.from(new Set(orders.map((order) => order.status.toUpperCase())))

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="text-purple-600">Loading session...</p>
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
      <div className="max-w-6xl mx-auto py-10 px-6 space-y-8">
        <div className="text-center relative py-6">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-contain bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%239333ea" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm0-200c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm0-320c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm0 80c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z"></path></svg>\')',
            }}
          ></div>
          <div className="flex items-center justify-center gap-2">
            <Package className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800">Order Management</h1>
          </div>
          <p className="text-purple-600 mt-1">Manage and track customer orders</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
            <Input
              placeholder="Search by order #, name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-purple-200 focus-visible:ring-purple-400 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full ${
                statusFilter === null
                  ? "bg-purple-100 text-purple-800 border-purple-200"
                  : "border-purple-200 text-purple-600"
              }`}
              onClick={() => setStatusFilter(null)}
            >
              All
            </Button>
            {uniqueStatuses.map((status) => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                className={`rounded-full ${
                  statusFilter === status
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : "border-purple-200 text-purple-600"
                }`}
                onClick={() => setStatusFilter(status === statusFilter ? null : status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="text-purple-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden p-12 text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
            <div className="flex flex-col items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center">
                <Package className="h-12 w-12 text-purple-300" />
              </div>
              <h2 className="text-xl font-medium text-purple-800">No Orders Found</h2>
              <p className="text-purple-600 max-w-md mx-auto">
                {searchTerm || statusFilter
                  ? "Try adjusting your search or filter criteria"
                  : "There are no orders in the system yet"}
              </p>
              {(searchTerm || statusFilter) && (
                <Button
                  variant="outline"
                  className="mt-2 border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter(null)
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              console.log('Rendering order ID:', order.id);
              return (
              <Card
                key={order.id}
                className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-purple-800">Order #{order.orderNumber}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </Badge>
                              <span className="text-sm text-purple-600">
                                {new Date(order.orderDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-purple-500 mt-0.5" />
                          <div>
                            <p className="text-purple-600">Customer</p>
                            <p className="font-medium text-purple-800">{order.username}</p>
                            <p className="text-purple-600 text-xs">{order.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-purple-500 mt-0.5" />
                          <div>
                            <p className="text-purple-600">Shipping Address</p>
                            <p className="font-medium text-purple-800">
                              {order.shippingAddress.city}, {order.shippingAddress.country}
                            </p>
                            <p className="text-purple-600 text-xs truncate max-w-[200px]">
                              {order.shippingAddress.street}, {order.shippingAddress.state}{" "}
                              {order.shippingAddress.zipCode}
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
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 transition-colors pr-0"
                        >
                          Manage Order <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>
        )}
      </div>

      <div className="h-16 w-full bg-gradient-to-t from-purple-100 to-transparent"></div>
    </div>
  )
}
