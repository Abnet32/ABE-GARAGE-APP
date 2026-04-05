"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import type { AdminView } from "@/types";
import { authClient } from "@/lib/auth-client";

function AdminPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  const allowedViews: AdminView[] = [
    "dashboard",
    "overview",
    "orders",
    "new-order",
    "edit-order",
    "calendar",
    "inventory",
    "employees",
    "add-employee",
    "edit-employee",
    "employee-detail",
    "customers",
    "add-customer",
    "edit-customer",
    "customer-detail",
    "services",
  ];

  const requestedView = (searchParams.get("view") || "dashboard") as AdminView;
  const initialView = allowedViews.includes(requestedView)
    ? requestedView
    : "dashboard";

  useEffect(() => {
    const role = String(session?.user.role || "").toLowerCase();
    if (!session || (role !== "admin" && role !== "employee")) {
      if (!isPending) {
        router.push("/login");
      }
      return;
    }

    setIsAuthorized(true);
  }, [isPending, router, session]);

  const handleNavigate = (view: AdminView, sectionId?: string) => {
    const pathMap: Record<AdminView, string> = {
      dashboard: "/admin",
      overview: "/admin?view=overview",
      orders: "/admin?view=orders",
      "new-order": "/admin?view=new-order",
      "edit-order": "/admin?view=edit-order",
      calendar: "/admin?view=calendar",
      inventory: "/admin?view=inventory",
      employees: "/admin?view=employees",
      "add-employee": "/admin?view=add-employee",
      "edit-employee": "/admin?view=edit-employee",
      "employee-detail": "/admin?view=employee-detail",
      customers: "/admin?view=customers",
      "add-customer": "/admin?view=add-customer",
      "edit-customer": "/admin?view=edit-customer",
      "customer-detail": "/admin?view=customer-detail",
      services: "/admin?view=services",
    };

    if (view === "dashboard") {
      router.push("/admin");
      return;
    }

    router.push(pathMap[view]);
    if (sectionId) {
      window.setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const handleLogout = () => {
    void authClient.signOut();
    router.push("/");
  };

  if (!isAuthorized) return null;

  return (
    <AdminDashboard
      initialView={initialView}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminPageContent />
    </Suspense>
  );
}
