import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

async function getAuthToken(request: NextRequest): Promise<string | null> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get("auth_token")?.value
  if (cookieToken) return cookieToken

  const authHeader = request.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken(request)

    console.log('GET User Reports - Token found:', token ? 'Yes' : 'No')

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      )
    }

    const url = `${API_URL}/reports/user`

    console.log('Fetching user reports from:', url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    console.log('Laravel response status:', response.status)

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch user reports" },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, reports: data.reports || data })
  } catch (error) {
    console.error("User Reports API Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
