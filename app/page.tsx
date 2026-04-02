"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../client/src/components/Header";
import Hero from "../client/src/components/Hero";
import About from "../client/src/components/About";
import Services from "../client/src/components/Services";
import QualitySection from "../client/src/components/QualitySection";
import WhyChooseUs from "../client/src/components/WhyChooseUs";
import LeaderBanner from "../client/src/components/LeaderBanner";
import Footer from "../client/src/components/Footer";
import ChatWidget from "../client/src/components/ChatWidget";

interface User {
  token: string;
  role: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    const role = window.localStorage.getItem("role");
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("role");
    setUser(null);
    router.push("/");
  };

  const handleNavigate = (
    view: "home" | "login" | "admin" | "contact" | "about" | "services",
    sectionId?: string,
  ) => {
    if (view === "home") {
      router.push("/");
      if (sectionId) {
        window.setTimeout(() => {
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
      return;
    }

    const pathMap: Record<
      "home" | "login" | "admin" | "contact" | "about" | "services",
      string
    > = {
      home: "/",
      login: "/login",
      admin: "/admin",
      contact: "/contact",
      about: "/about",
      services: "/services",
    };

    router.push(pathMap[view]);
  };

  const handleOpenChatWithPrompt = (prompt: string) => {
    setChatInitialMessage(prompt);
    setIsChatOpen(true);
  };

  return (
    <>
      <Header
        currentView="home"
        onNavigate={handleNavigate}
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />

      <main>
        <Hero />
        <About onNavigate={handleNavigate} />
        <Services onLearnMore={handleOpenChatWithPrompt} />
        <QualitySection />
        <WhyChooseUs />
        <LeaderBanner />
      </main>

      <Footer onNavigate={handleNavigate} />

      <ChatWidget
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        initialMessage={chatInitialMessage}
      />
    </>
  );
}
