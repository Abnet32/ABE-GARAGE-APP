import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL || "http://localhost:5500/api";

const buildHeaders = (request: NextRequest): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    headers.Authorization = authHeader;
  }

  return headers;
};

const toJsonResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  }

  const text = await response.text();
  return NextResponse.json(
    { message: text || "Unexpected backend response" },
    { status: response.status },
  );
};

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/orders`, {
      method: "GET",
      headers: buildHeaders(request),
      cache: "no-store",
    });

    return toJsonResponse(response);
  } catch (error) {
    console.error("Orders proxy GET failed:", error);
    return NextResponse.json(
      { message: "Failed to reach backend orders service" },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await fetch(`${BACKEND_BASE_URL}/orders`, {
      method: "POST",
      headers: buildHeaders(request),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    return toJsonResponse(response);
  } catch (error) {
    console.error("Orders proxy POST failed:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 503 },
    );
  }
}
