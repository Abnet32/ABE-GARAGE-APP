import React from "react";
import {
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";

interface FooterProps {
  onNavigate: (
    view: "home" | "login" | "admin" | "contact" | "services" | "about",
    sectionId?: string,
  ) => void;
  showAppointmentBanner?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  onNavigate,
  showAppointmentBanner = true,
}) => {
  const handleLinkClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  return (
    <footer
      id="contact"
      className="bg-brand-blue text-white font-sans scroll-mt-20"
    >
      {/* Appointment Banner */}
      {showAppointmentBanner && (
        <div className="container mx-auto px-4 m-10 -translate-y-1/2">
          <div className="bg-brand-red p-8 md:p-12 flex flex-col md:flex-row justify-between items-center shadow-2xl">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl md:text-4xl font-normal font-heading mb-2">
                Schedule Your Appointment Today
              </h3>
              <p className="text-white/80 text-sm">
                Your Automotive Repair & Maintenance Service Specialist
              </p>
            </div>
            <div className="flex items-center gap-8">
              <span className="text-3xl font-bold font-heading">
                +251-922-019-117
              </span>
              <button
                onClick={() => onNavigate("contact")}
                className="bg-white text-brand-blue px-6 py-3 text-xs font-bold tracking-widest flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                CONTACT US <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pb-16 pt-8">
        {/* Contact Icons Strip */}
        <div className="flex flex-col md:flex-row justify-between border-b border-gray-800 pb-12 mb-12">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-brand-blue p-3 border border-gray-700 rounded-full">
              <MapPin className="text-brand-red" size={20} />
            </div>
            <div>
              <p className="text-base text-white font-heading">
                Addis Ababa, Ethiopia
              </p>
              <p className="text-xs text-gray-400">6 Kilo, Addis Ababa</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-brand-blue p-3 border border-gray-700 rounded-full">
              <Mail className="text-brand-red" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email us :</p>
              <p className="text-xs text-white">contact@abegarage.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-brand-blue p-3 border border-gray-700 rounded-full">
              <Phone className="text-brand-red" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Call us on :</p>
              <p className="text-lg text-white font-bold">+251-922-019-117</p>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-400">
          <div className="md:col-span-1">
            <div className="flex items-baseline gap-2 mb-6">
              {/* Logo Text kept in Amharic */}
              <h4
                className="text-white font-bold font-amharic text-2xl cursor-pointer"
                onClick={() => onNavigate("home")}
              >
                <span className="text-brand-red">አቤ</span> ጋራዥ
              </h4>
            </div>
            <p className="leading-relaxed text-xs">
              Capitalize on low hanging fruit to identify a ballpark value added
              activity to beta test. Override the digital divide additional
              clickthroughs.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold font-heading text-lg mb-6">
              Useful Links
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href="#"
                  onClick={(e) => handleLinkClick(e, () => onNavigate("home"))}
                  className="hover:text-brand-red transition-colors hover:text-red-600"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleLinkClick(e, () => onNavigate("about"))}
                  className="hover:text-brand-red transition-colors hover:text-red-600"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) =>
                    handleLinkClick(e, () => onNavigate("contact"))
                  }
                  className="hover:text-brand-red transition-colors hover:text-red-600"
                >
                  Appointment
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleLinkClick(e, () => onNavigate("about"))}
                  className="hover:text-brand-red transition-colors hover:text-red-600"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) =>
                    handleLinkClick(e, () => onNavigate("contact"))
                  }
                  className="hover:text-brand-red transition-colors hover:text-red-600"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold font-heading text-lg mb-6">
              Our Services
            </h4>
            <ul className="space-y-3 text-xs">
              {[
                "Performance Upgrade",
                "Transmission Service",
                "Break Repair & Service",
                "Engine Service & Repair",
                "Trye & Wheels",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={(e) =>
                      handleLinkClick(e, () => onNavigate("services"))
                    }
                    className="hover:text-brand-red transition-colors hover:text-red-600"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold font-heading text-lg mb-6">
              Newsletter
            </h4>
            <p className="text-xs mb-4">Get latest updates and offers.</p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="border border-gray-600 p-2 rounded-full hover:bg-brand-red hover:border-brand-red transition-colors hover:bg-red-600"
              >
                <Facebook size={14} />
              </a>
              <a
                href="#"
                className="border border-gray-600 p-2 rounded-full hover:bg-brand-red hover:border-brand-red transition-colors hover:bg-red-600"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="#"
                className="border border-gray-600 p-2 rounded-full hover:bg-brand-red hover:border-brand-red transition-colors hover:bg-red-600"
              >
                <Twitter size={14} />
              </a>
              <a
                href="#"
                className="border border-gray-600 p-2 rounded-full hover:bg-brand-red hover:border-brand-red transition-colors hover:bg-red-600"
              >
                <Instagram size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
