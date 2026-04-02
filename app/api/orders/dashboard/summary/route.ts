import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL || "http://localhost:5500/api";

export async function GET() {
  try {
    const response = await fetch(
      `${BACKEND_BASE_URL}/orders/dashboard/summary`,
      {
        cache: "no-store",
      },
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Dashboard summary proxy failed:", error);
    return NextResponse.json(
      { message: "Failed to load dashboard summary" },
      { status: 500 },
    );
  }
}
