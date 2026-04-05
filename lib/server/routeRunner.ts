/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/server/configs/db";
import { runExpressChain } from "@/lib/server/adapter";

type RouteContext = {
  params?: Record<string, string>;
};

export const runRoute = async (
  request: NextRequest,
  context: RouteContext,
  handler: (...args: any[]) => unknown,
  middlewares: unknown = [],
): Promise<NextResponse> => {
  await connectDB();

  const middlewareChain = Array.isArray(middlewares)
    ? (middlewares as Array<(...args: any[]) => unknown>)
    : [];

  return runExpressChain({
    request,
    params: context.params,
    middlewares: middlewareChain,
    handler,
  });
};
