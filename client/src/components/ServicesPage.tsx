import React from "react";
import PageHeader from "./PageHeader";
import {
  IconPerformance,
  IconTransmission,
  IconBrake,
  IconEngine,
  IconTyre,
  IconPaint,
} from "./Icons";
import one from "../assets/1.avif";
import two from "../assets/2.avif";
import three from "../assets/3.avif";
import four from "../assets/4.avif";
import five from "../assets/5.avif";
import six from "../assets/6.avif";

interface ServicesPageProps {
  onLearnMore: (prompt: string) => void;
}

interface ServiceData {
  title: string;
  image: string;
  description: string;
  extendedDescription: string;
  features: string[];
  prompt?: string;
  icon: React.ReactNode;
}

interface ServiceCardProps {
  service: ServiceData;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white group hover:shadow-2xl hover:border-red-600 transition-all duration-300 border-b-[3px] border-transparent hover:border-brand-red cursor-pointer flex flex-col h-full transform hover:-translate-y-2 hover:scale-[1.02]"
  >
    <div className="h-52 overflow-hidden relative">
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
    </div>

    <div className="p-8 flex flex-col flex-1">
      <h4 className="text-xl font-bold text-brand-blue font-heading mb-3 group-hover:text-gray-800 transition-colors">
        {service.title}
      </h4>
      <p className="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-3 flex-1">
        {service.description}
      </p>

      <div className="mt-auto flex items-end justify-between">
        <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider group-hover:underline flex items-center gap-1">
          Read More{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:rotate-90">
            +
          </span>
        </span>

        <div className="opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 text-brand-blue group-hover:text-brand-red">
          {service.icon}
        </div>
      </div>
    </div>
  </div>
);

const ServicesPage: React.FC<ServicesPageProps> = ({ onLearnMore }) => {
  const services: ServiceData[] = [
    {
      title: "Performance Upgrade",
      image: one.src,
      description:
        "Unlock the full potential of your vehicle with our expert performance tuning and upgrade services.",
      extendedDescription:
        "Unleash your vehicle's true potential with our specialized Performance Upgrade services. We don't just add parts; we engineer solutions to enhance horsepower, torque, and handling. From ECU remapping to high-performance exhaust systems and turbocharging, our master mechanics ensure your car performs at its peak without compromising reliability.",
      features: [
        "ECU Tuning & Remapping",
        "Turbo & Supercharger Installation",
        "Cold Air Intakes",
        "Performance Exhaust Systems",
        "Suspension Lowering & Handling Kits",
      ],
      prompt:
        "I'm interested in upgrading my car's performance. Can you explain what options you offer, such as engine tuning, turbo upgrades, or suspension modifications?",
      icon: <IconPerformance />,
    },
    {
      title: "Transmission Services",
      image: two.src,
      description:
        "Complete transmission maintenance, repair, and replacement services for automatic and manual vehicles.",
      extendedDescription:
        "Your transmission is the heart of your vehicle's drivetrain. Our Transmission Services cover everything from routine fluid changes to complete rebuilds. We use advanced diagnostic tools to pinpoint shifting issues, slips, or noises, ensuring smooth gear changes and extending the lifespan of your vehicle.",
      features: [
        "Fluid Flush & Replacement",
        "Clutch Repair & Replacement",
        "Transmission Rebuilds",
        "Differential Service",
        "Solenoid & Sensor Testing",
      ],
      icon: <IconTransmission />,
    },
    {
      title: "Brake Repair & Service",
      image: three.src,
      description:
        "Safety first. We provide comprehensive brake inspections, pad replacements, and rotor resurfacing.",
      extendedDescription:
        "Safety is non-negotiable. Our Brake Repair & Service ensures your vehicle stops effectively every time. We inspect the entire braking system, including pads, rotors, calipers, and lines. Whether it's a squeaky brake or a soft pedal, we fix it with premium parts to guarantee your safety on the road.",
      features: [
        "Brake Pad Replacement",
        "Rotor Resurfacing & Replacement",
        "Brake Fluid Flush",
        "ABS Diagnostics",
        "Caliper Service",
      ],
      icon: <IconBrake />,
    },
    {
      title: "Engine Service & Repair",
      image: four.src,
      description:
        "From check engine lights to complete overhauls, our expert mechanics handle all engine related issues.",
      extendedDescription:
        "The engine is the most complex part of your car. Our Engine Service & Repair includes deep diagnostics, timing belt replacements, head gasket repairs, and complete engine overhauls. We treat every engine with precision, restoring power and efficiency to factory standards or better.",
      features: [
        "Check Engine Light Diagnostics",
        "Timing Belt/Chain Replacement",
        "Head Gasket Repair",
        "Engine Overhauls",
        "Cooling System Repair",
      ],
      icon: <IconEngine />,
    },
    {
      title: "Tyre & Wheels",
      image: five.src,
      description:
        "Tire rotation, balancing, alignment and replacement services to ensure a smooth and safe ride.",
      extendedDescription:
        "Tires are your only contact with the road. Our Tyre & Wheel services maximize traction, fuel economy, and tire life. We offer computerized balancing, laser alignment, and professional tire mounting. We also help you choose the right tires for your specific driving needs and road conditions.",
      features: [
        "Computerized Wheel Alignment",
        "Wheel Balancing",
        "Tire Rotation",
        "Flat Tire Repair",
        "TPMS Service",
      ],
      icon: <IconTyre />,
    },
    {
      title: "Denting & Painting",
      image: six.src,
      description:
        "Restore your car to its factory glory with our professional dent removal and paint matching services.",
      extendedDescription:
        "Restore your car's aesthetic appeal with our Denting & Painting services. Whether it's a minor scratch or major collision damage, our body shop experts use precision color-matching technology and high-quality clear coats to bring back that showroom shine. We ensure structural integrity and a flawless finish.",
      features: [
        "Paintless Dent Removal",
        "Scratch & Chip Repair",
        "Full Body Painting",
        "Bumper Repair",
        "Frame Straightening",
      ],
      icon: <IconPaint />,
    },
  ];

  return (
    <section className="min-h-screen bg-gray-50">
      <PageHeader title="Our Services" breadcrumb="Services" />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mb-12">
          <h3 className="text-3xl font-bold text-brand-blue font-heading mb-4">
            World Class Car Services
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            We offer a full range of garage services to vehicle owners located
            in the area. All mechanic services are performed by highly qualified
            mechanics. We can handle any car problem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              onClick={() =>
                onLearnMore(
                  service.prompt ||
                    `I would like to get a price estimate for ${service.title}. What is the typical price range for this service in Addis Ababa?`,
                )
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
