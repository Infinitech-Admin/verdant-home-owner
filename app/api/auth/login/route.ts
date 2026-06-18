import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://abicrealtyphlloyd.com/api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({
        success: data.success,
        message: data.message,
        errors: data.errors,
        data: data.data
      }, { status: response.status })
    }

    const token = data.token
    const user = data.user

    if (!token || !user || !user.role) {
      return NextResponse.json(
        { success: false, message: "Invalid response from server" },
        { status: 500 }
      )
    }

    // Store token in HTTP-only cookie
    const cookieStore = await cookies()
    
    cookieStore.set('auth_token', token, {
      httpOnly: true,              // ✅ JavaScript cannot access
      secure: true,                 // ✅ HTTPS only
      sameSite: 'none',            // ✅ Required for cross-domain
      maxAge: 60 * 60 * 24 * 7,    // 7 days
      path: '/',
    })

    // ✅ IMPORTANT: NEVER return the token to the client
    // Only return user data
    return NextResponse.json({
      success: true,
      message: data.message || "Login successful",
      user: user, // Only user data, NO TOKEN
    }, { status: 200 })
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to authentication server",
      },
      { status: 500 }
    )
  }
}
