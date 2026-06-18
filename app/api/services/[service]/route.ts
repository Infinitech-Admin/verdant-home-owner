// PATH: app/api/services/[service]/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// GET /api/services/[service] → Laravel GET /api/services/{service}
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ service: string }> },
) {
  try {
    const { service } = await params;

    const response = await fetch(`${API_URL}/services/${service}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Service not found" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Service GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
