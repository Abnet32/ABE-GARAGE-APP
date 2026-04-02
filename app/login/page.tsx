"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Login from "../../client/src/components/Login";

export default function LoginPage() {
  const router = useRouter();

  return (
    <Login
      onLogin={(token, role, userId) => {
        const normalizedRole = role.toLowerCase();
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("role", normalizedRole);
        if (userId) {
          window.localStorage.setItem("userId", userId);
        } else {
          window.localStorage.removeItem("userId");
        }

        router.push(normalizedRole === "admin" ? "/admin" : "/");
      }}
    />
  );
}
