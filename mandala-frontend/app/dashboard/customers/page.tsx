"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { Loader2 } from "lucide-react"

type UserDto = {
  id: number
  username: string
  email: string
  role: string
  phoneNumber?: string
}

export default function CustomersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const token = session?.accessToken
  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  const handleDelete = async (userId: number) => {
    if (!token || !window.confirm("Are you sure you want to delete this user?")) return

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        // Refresh the user list after successful deletion
        fetchUsers()
      } else {
        console.error("Failed to delete user")
      }
    } catch (err) {
      console.error("Error deleting user:", err)
    }
  }

  if (status === "loading") return <p>Loading session...</p>
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200 p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-black">Customer List</CardTitle>
            <CardDescription className="text-black">All registered users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                <span className="ml-2 text-purple-600">Loading users...</span>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={users}
                onDelete={handleDelete}
                onEdit={(userId) => router.push(`/admin/customers/edit/${userId}`)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

