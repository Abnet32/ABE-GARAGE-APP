import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import PageHeader from "./PageHeader";

const ContactPage: React.FC = () => {
  return (
    <section className="animate-in fade-in duration-500">
      <PageHeader title="Contact Us" breadcrumb="Contact Us" />

      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Map Section (Left) */}
          <div className="lg:w-1/2 h-[400px] bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200 shadow-sm">
            {/* Simulated Map Interface */}
            <div className="absolute inset-0 bg-[url('https://mt1.google.com/vt/lyrs=m&x=10&y=10&z=10')] bg-cover bg-center opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?q=Shiromeda,+Addis+Ababa&t=&z=15&ie=UTF8&iwloc=&output=embed"
              ></iframe>
            </div>
            <div className="absolute top-4 left-4 bg-white p-4 shadow-md rounded max-w-[200px]">
              <h4 className="font-bold text-sm text-brand-blue mb-1">
                Abe Garage
              </h4>
              <p className="text-[10px] text-gray-500 leading-tight">
                Addis Ababa, Ethiopia
              </p>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-red-500">
                ★★★★☆{" "}
                <span className="text-blue-400 underline ml-1">
                  124 reviews
                </span>
              </div>
            </div>
          </div>

          {/* Info Section (Right) */}
          <div className="lg:w-1/2">
            <h3 className="text-2xl font-bold text-brand-blue font-heading mb-8">
              Our Address
            </h3>
            <p className="text-gray-500 text-sm mb-10 leading-relaxed">
              Completely synergize resource taxing relationships via premier
              niche markets. Professionally cultivate one-to-one customer
              service.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="text-brand-red mt-1">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-blue font-heading mb-1">
                    Address:
                  </h4>
                  <p className="text-sm text-gray-500">Addis Ababa, Ethiopia</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-brand-red mt-1">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-blue font-heading mb-1">
                    Email:
                  </h4>
                  <p className="text-sm text-gray-500">contact@abegarage.com</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-brand-red mt-1">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-blue font-heading mb-1">
                    Phone:
                  </h4>
                  <p className="text-sm text-gray-500">+251-922-019-117</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
