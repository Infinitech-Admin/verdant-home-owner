import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No authentication token found" },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      )
    }

    const data = await response.json()
    const user = data.data?.user || data.user || data

    return NextResponse.json({
      success: true,
      user: user,
    }, { status: 200 })

  } catch (error) {
    console.error("Auth verification error:", error instanceof Error ? error.message : "Unknown error")
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify authentication",
      },
      { status: 500 }
    )
  }
}
