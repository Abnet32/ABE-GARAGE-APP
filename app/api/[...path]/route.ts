import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL || "http://localhost:5500/api";

const buildBackendUrl = (path: string[], request: NextRequest) => {
  const cleanBase = BACKEND_BASE_URL.replace(/\/$/, "");
  const joinedPath = path.join("/");
  const query = request.nextUrl.search || "";
  return `${cleanBase}/${joinedPath}${query}`;
};

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

const proxy = async (request: NextRequest, path: string[]) => {
  const backendUrl = buildBackendUrl(path, request);

  try {
    const method = request.method;
    const hasBody = method !== "GET" && method !== "HEAD";
    const body = hasBody ? await request.text() : undefined;

    const response = await fetch(backendUrl, {
      method,
      headers: buildHeaders(request),
      body,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": contentType || "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(
      `API proxy ${request.method} failed for ${backendUrl}:`,
      error,
    );
    return NextResponse.json(
      {
        message: "Backend API unavailable",
        backendUrl,
      },
      { status: 503 },
    );
  }
};

type Params = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxy(request, path);
}

export async function POST(request: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxy(request, path);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxy(request, path);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxy(request, path);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { path } = await params;
  return proxy(request, path);
}
