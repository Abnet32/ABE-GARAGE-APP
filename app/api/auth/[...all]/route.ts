import { toNextJsHandler } from "better-auth/next-js";
import { auth, ensureAuthMongoConnected } from "@/lib/auth";
import type { NextRequest } from "next/server";

const handlers = toNextJsHandler(auth);

type AuthRouteContext = { params: Promise<{ all: string[] }> };

export async function GET(request: NextRequest, context: AuthRouteContext) {
  await ensureAuthMongoConnected();
  void context;
  return handlers.GET(request);
}

export async function POST(request: NextRequest, context: AuthRouteContext) {
  await ensureAuthMongoConnected();
  void context;
  return handlers.POST(request);
}

export async function PUT(request: NextRequest, context: AuthRouteContext) {
  await ensureAuthMongoConnected();
  void context;
  return handlers.PUT(request);
}

export async function PATCH(request: NextRequest, context: AuthRouteContext) {
  await ensureAuthMongoConnected();
  void context;
  return handlers.PATCH(request);
}

export async function DELETE(request: NextRequest, context: AuthRouteContext) {
  await ensureAuthMongoConnected();
  void context;
  return handlers.DELETE(request);
}
