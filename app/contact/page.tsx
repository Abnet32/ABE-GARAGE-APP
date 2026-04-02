"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ContactPage from "../../client/src/components/ContactPage";
import Header from "../../client/src/components/Header";
import Footer from "../../client/src/components/Footer";

export default function ContactRoutePage() {
  const router = useRouter();
  const handleNavigate = (
    view: "home" | "login" | "admin" | "contact" | "about" | "services",
  ) => {
    router.push(view === "home" ? "/" : `/${view}`);
  };

  return (
    <>
      <Header
        currentView="contact"
        onNavigate={handleNavigate}
        isLoggedIn={false}
        onLogout={() => undefined}
      />
      <ContactPage />
      <Footer onNavigate={handleNavigate} />
    </>
  );
}
