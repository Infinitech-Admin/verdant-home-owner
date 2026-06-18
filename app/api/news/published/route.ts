import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    
    console.log("[News API] Fetching from:", `${API_URL}/news/published${queryString ? `?${queryString}` : ''}`)

    const response = await fetch(`${API_URL}/news/published${queryString ? `?${queryString}` : ''}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: 'no-store'
    })

    const responseText = await response.text()
    console.log("[News API] Response status:", response.status)

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText)
        return NextResponse.json(
          {
            error: errorData.message || "Failed to fetch news",
            details: errorData.errors || errorData,
          },
          { status: response.status },
        )
      } catch {
        return NextResponse.json(
          { error: "Failed to fetch news from server" }, 
          { status: response.status }
        )
      }
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[News API] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" }, 
      { status: 500 }
    )
  }
}