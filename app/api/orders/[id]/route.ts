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

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const response = await fetch(`${BACKEND_BASE_URL}/orders/${id}`, {
      method: "GET",
      headers: buildHeaders(request),
      cache: "no-store",
    });

    return toJsonResponse(response);
  } catch (error) {
    console.error("Order proxy GET failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 503 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const response = await fetch(`${BACKEND_BASE_URL}/orders/${id}`, {
      method: "PUT",
      headers: buildHeaders(request),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    return toJsonResponse(response);
  } catch (error) {
    console.error("Order proxy PUT failed:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 503 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const response = await fetch(`${BACKEND_BASE_URL}/orders/${id}`, {
      method: "DELETE",
      headers: buildHeaders(request),
      cache: "no-store",
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return toJsonResponse(response);
  } catch (error) {
    console.error("Order proxy DELETE failed:", error);
    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 503 },
    );
  }
}
