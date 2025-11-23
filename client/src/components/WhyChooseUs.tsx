import React from "react";
import { UserCheck, Wrench, Tag, Trophy, Check } from "lucide-react";
import fourteen from '../assets/14.avif'

const FeatureItem = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-6 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
    <div className="text-brand-red border border-brand-red/20 p-3 rounded-full">
      {icon}
    </div>
    <span className="font-bold text-brand-blue font-heading text-lg">
      {title}
    </span>
  </div>
);

const WhyChooseUs: React.FC = () => {
  const additionalServices = [
    "General Auto Repair & Maintenance",
    "Transmission Repair & Replacement",
    "Tire Repair and Replacement",
    "State Emissions Inspection",
    "Break Job / Break Services",
    "Electrical Diagnostics",
    "Fuel System Repairs",
    "Starting and Charging Repair",
    "Steering and Suspension Work",
    "Emission Repair Facility",
    "Wheel Alignment",
    "Computer Diagnostic Testing",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Why Choose Us */}
          <div className="lg:w-1/2">
            <h3 className="text-3xl font-bold text-brand-blue font-heading relative inline-block mb-8">
              Why Choose Us
              <div className="absolute -right-16 top-1/2 h-[2px] w-12 bg-brand-red"></div>
            </h3>
            <p className="text-gray-500 text-sm mb-8">
              Bring to the table win-win survival strategies to ensure proactive
              domination. At the end of the day, going forward, a new normal
              that has evolved from generation heading towards.
            </p>

            <div className="flex flex-col">
              <FeatureItem
                icon={<UserCheck size={24} />}
                title="Certified Expert Mechanics"
              />
              <FeatureItem
                icon={<Wrench size={24} />}
                title="Fast And Quality Service"
              />
              <FeatureItem
                icon={<Tag size={24} />}
                title="Best Prices in Town"
              />
              <FeatureItem
                icon={<Trophy size={24} />}
                title="Awarded Workshop"
              />
            </div>
          </div>

          {/* Additional Services */}
          <div className="lg:w-1/2">
            <h3 className="text-3xl font-bold text-brand-blue font-heading relative inline-block mb-8">
              Addtional Services
              <div className="absolute -right-16 top-1/2 h-[2px] w-12 bg-brand-red"></div>
            </h3>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 h-[320px] overflow-hidden">
                <img
                  src={fourteen}
                  alt="Classic Car"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2">
                <ul className="space-y-3">
                  {additionalServices.map((service, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-xs text-gray-700 font-medium"
                    >
                      <Check
                        size={14}
                        className="text-brand-red min-w-[14px] mt-0.5"
                      />
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
