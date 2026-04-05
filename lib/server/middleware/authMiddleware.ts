import { type NextFunction, type Request, type Response } from "express";
import { auth as betterAuth, ensureAuthMongoConnected } from "@/lib/auth";

type SessionUser = NonNullable<
  Awaited<ReturnType<typeof betterAuth.api.getSession>>
>["user"];

const SESSION_LOOKUP_TIMEOUT_MS = 12000;

const SESSION_TIMEOUT = Symbol("SESSION_TIMEOUT");

const getSessionWithTimeout = async (headers: Headers) => {
  return Promise.race([
    betterAuth.api.getSession({ headers }),
    new Promise<typeof SESSION_TIMEOUT>((resolve) => {
      setTimeout(() => resolve(SESSION_TIMEOUT), SESSION_LOOKUP_TIMEOUT_MS);
    }),
  ]);
};

export const auth = async (
  req: Request,
  res: Response,
  next?: NextFunction,
) => {
  let session: Awaited<ReturnType<typeof getSessionWithTimeout>>;

  try {
    await ensureAuthMongoConnected();
    session = await getSessionWithTimeout(
      new Headers(req.headers as Record<string, string>),
    );
  } catch {
    return res.status(503).json({ message: "Auth service unavailable" });
  }

  if (!session) {
    return res.status(401).json({ message: "Authorization denied" });
  }

  if (session === SESSION_TIMEOUT) {
    return res.status(503).json({ message: "Auth service timeout" });
  }

  (req as Request & { user?: SessionUser }).user = session.user;
  next?.();
};
