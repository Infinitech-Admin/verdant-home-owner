import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error("Laravel logout failed:", error)
      }
    }

    cookieStore.delete('auth_token')

    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    }, { status: 200 })

  } catch (error) {
    console.error("Logout error:", error instanceof Error ? error.message : "Unknown error")
    
    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
      },
      { status: 500 }
    )
  }
}
