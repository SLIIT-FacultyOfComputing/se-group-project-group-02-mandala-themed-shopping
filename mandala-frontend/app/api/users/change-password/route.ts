import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

export async function PUT(req: NextRequest) {
  try {
    // Get user session to verify the user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { currentPassword, newPassword } = await req.json()
    
    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }
    
    // Call backend API to verify current password and update to new password
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/updatePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        username: session.user.name,
        currentPassword: currentPassword,
        password: newPassword
      }),
    })
    
    let errorMessage = "Failed to update password"
    
    if (!response.ok) {
      try {
        const errorData = await response.json()
        if (errorData && errorData.message) {
          errorMessage = errorData.message
        }
      } catch (e) {
        console.error("Error parsing response:", e)
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 