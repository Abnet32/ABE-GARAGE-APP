import { NextRequest } from "next/server";
import {
  customerRegister,
  getAllCustomers,
} from "@/lib/server/controllers/customerController";
import { auth } from "@/lib/server/middleware/authMiddleware";
import { adminOrEmployee } from "@/lib/server/middleware/roleMiddleware";
import { runRoute } from "@/lib/server/routeRunner";

export async function GET(request: NextRequest) {
  return runRoute(request, {}, getAllCustomers, [auth, adminOrEmployee]);
}

export async function POST(request: NextRequest) {
  return runRoute(request, {}, customerRegister, [auth, adminOrEmployee]);
}
