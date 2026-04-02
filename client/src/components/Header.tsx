/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Clock, Menu, X, Phone } from "lucide-react";

interface HeaderProps {
  currentView: "home" | "login" | "admin" | "contact" | "about" | "services";
  onNavigate: (
    view: "home" | "login" | "admin" | "contact" | "about" | "services",
    sectionId?: string
  ) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  isLoggedIn,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "HOME", href: "#home" },
    { label: "ABOUT US", href: "#about", view: "about" },
    { label: "SERVICES", href: "#services", view: "services" },
    { label: "CONTACT US", href: "#contact", view: "contact" },
    { label: "ADMIN", href: "#", hasBorder: true, view: "admin" },
  ];

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (item.label === "ADMIN") {
      if (isLoggedIn) {
        onNavigate("admin");
      } else {
        onNavigate("login");
      }
      return;
    }

    if (item.view) {
      onNavigate(item.view);
      return;
    }

    if (item.href.startsWith("#")) {
      const sectionId = item.href.replace("#", "");
      if (sectionId === "home") {
        onNavigate("home");
      } else {
        onNavigate("home", sectionId);
      }
    }
  };

  return (
    <header className="w-full font-sans z-50 sticky top-0 shadow-sm">
      {/* Top Bar: Blue Background with Red Left Segment */}
      <div className="bg-brand-blue text-white text-2xs overflow-hidden ">
        <div className="mx-auto flex justify-between items-center h-10 md:h-12">
          <div className="flex h-full items-center">
            {/* Red Block for Slogan - Extended to left with pseudo-element */}
            <div className="bg-brand-red h-full  flex items-center px-4 md:px-6 relative mr-4 md:mr-6 skew-x-0 before:content-[''] before:absolute before:top-0 before:bottom-0 before:right-full before:w-screen before:bg-brand-red">
              <span className="text-white/90 whitespace-nowrap relative z-10 tracking-wide font-medium">
                Enjoy the Beso while we fix your car
              </span>
            </div>

            {/* Blue Section Content */}
            <span className="hidden md:flex items-center gap-2 text-white/80">
              <Clock size={14} /> Monday - Saturday 7:00AM - 6:00PM
            </span>
          </div>

          <div className="font-bold pr-10 z-10 flex gap-1">
            {isLoggedIn ? (
              "Welcome Admin"
            ) : (
              <>
                <span className="text-gray-400 hidden sm:inline">
                  Call Abe:
                </span>
                <span>+251-922-019-117</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation - White Background */}
      <div className="bg-white shadow-md relative">
        <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          {/* Logo (Kept in Amharic) */}
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => onNavigate("home")}
          >
            <div className="relative w-fit">
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-blue tracking-tight font-amharic">
                  <span className="text-brand-red">አቤ</span> ጋራዥ
                </h1>
              </div>
              {/* Updated Logo Underline: Red and Blue segments */}
              <div className="h-1.5 w-full bg-gray-100 mt-1 rounded-full overflow-hidden flex">
                <div className="h-full w-1/2 bg-brand-blue"></div>
                <div className="h-full w-1/2 bg-brand-red"></div>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 font-heading font-bold text-base tracking-wide text-brand-blue">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`hover:text-brand-red transition-colors cursor-pointer flex flex-col items-center group hover:text-red-500 ${
                  item.hasBorder ? "border-r border-gray-300 pr-6" : ""
                } ${
                  (currentView === "home" && item.href === "#home") ||
                  currentView === item.view
                    ? "text-brand-red"
                    : ""
                }`}
              >
                <span>{item.label}</span>
              </a>
            ))}

            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="bg-brand-blue text-white px-6 py-2 text-xs font-bold hover:bg-red-700 transition-colors"
              >
                LOG OUT
              </button>
            ) : (
              <button
                onClick={() => onNavigate("login")}
                className="bg-brand-blue text-white px-6 py-2 text-sm font-bold hover:bg-red-700 transition-colors"
              >
                SIGN IN
              </button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-brand-blue p-2 hover:bg-gray-100 rounded-md transition-colors border border-gray-100 shadow-sm shrink-0 ml-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col p-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`py-4 px-4 font-bold font-heading border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors hover:text-red-500  ${
                    (currentView === "home" && item.href === "#home") ||
                    currentView === item.view
                      ? "text-brand-red"
                      : "text-brand-blue"
                  }`}
                >
                  {item.label}
                </a>
              ))}

              {/* Additional Mobile Info (Hours, etc) */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-2 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-brand-red" />
                  <span>Mon - Sat: 7:00AM - 6:00PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-brand-red" />
                  <span>+251922019117</span>
                </div>
              </div>

              <div className="mt-6 px-4 pb-2">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-brand-blue text-white px-6 py-4 text-sm font-bold hover:bg-red-700 transition-colors rounded shadow-sm uppercase tracking-widest"
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate("login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-brand-blue text-white px-6 py-4 text-sm font-bold hover:bg-red-700 transition-colors rounded shadow-sm uppercase tracking-widest"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
