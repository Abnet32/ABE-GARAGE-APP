"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "../../client/src/components/AdminDashboard";
import type { AdminView } from "../../client/src/types";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  useEffect(() => {
    const role = window.localStorage.getItem("role");
    if ((role || "").toLowerCase() !== "admin") {
      router.push("/login");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

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

    if (view === "dashboard" || view === "overview") {
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
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("role");
    router.push("/");
  };

  if (!isAuthorized) return null;

  return <AdminDashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
}
