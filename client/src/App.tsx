/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import QualitySection from "./components/QualitySection";
import WhyChooseUs from "./components/WhyChooseUs";
import LeaderBanner from "./components/LeaderBanner";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import Login from "./components/Login";
import { AdminDashboard } from "./components/AdminDashboard";
import ContactPage from "./components/ContactPage";
import AboutPage from "./components/AboutPage";
import ServicesPage from "./components/ServicesPage";

type ViewState = "home" | "login" | "admin" | "contact" | "about" | "services";

interface User {
  token: string;
  role: string;
}

// Wrapper to sync route with currentView
const AppWrapper: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string>("");

  useEffect(() => {
    // Determine current view from pathname
    const path = location.pathname.replace("/", "");
    const viewMap: Record<string, ViewState> = {
      "": "home",
      login: "login",
      admin: "admin",
      contact: "contact",
      about: "about",
      services: "services",
    };
    setCurrentView(viewMap[path] || "home");
  }, [location]);

  useEffect(() => {
    // Load user from localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) setUser({ token, role });
  }, []);

  const handleLogin = (token: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
    navigate(role === "admin" ? "/admin" : "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/");
  };

  const handleNavigate = (view: string, sectionId?: string) => {
    // Normalize admin-specific views (e.g. "dashboard") to the public 'admin' view
    const normalizedView: ViewState =
      view === "dashboard"
        ? "admin"
        : ["home", "login", "admin", "contact", "about", "services"].includes(view)
        ? (view as ViewState)
        : "home";

    setCurrentView(normalizedView);

    // Map view to route
    const pathMap: Record<string, string> = {
      home: "/",
      login: "/login",
      admin: "/admin",
      contact: "/contact",
      about: "/about",
      services: "/services",
      dashboard: "/admin",
    };
    navigate(pathMap[view] || pathMap[normalizedView]);

    if (normalizedView === "home" && sectionId) {
      setScrollTarget(sectionId);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleOpenChatWithPrompt = (prompt: string) => {
    setChatInitialMessage(prompt);
    setIsChatOpen(true);
  };

  return (
    <>
      {currentView !== "admin" && (
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          isLoggedIn={!!user}
          onLogout={handleLogout}
        />
      )}

      <main>
        {currentView === "home" && (
          <>
            <Hero />
            <About onNavigate={handleNavigate} />
            <Services onLearnMore={handleOpenChatWithPrompt} />
            <QualitySection />
            <WhyChooseUs />
            <LeaderBanner />
          </>
        )}

        {currentView === "login" && <Login onLogin={handleLogin} />}
        {currentView === "admin" && user?.role === "admin" && (
          <AdminDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
        )}
        {currentView === "contact" && <ContactPage />}
        {currentView === "about" && <AboutPage onNavigate={handleNavigate} />}
        {currentView === "services" && (
          <ServicesPage onLearnMore={handleOpenChatWithPrompt} />
        )}
      </main>

      {currentView !== "admin" && <Footer onNavigate={handleNavigate} />}

      <ChatWidget
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        initialMessage={chatInitialMessage}
      />
    </>
  );
};

const App: React.FC = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
