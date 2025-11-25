import React from "react";
import {
  // Activity,
  // Disc,
  // Move,
  // Settings,
  // Battery,
  // Thermometer,
  // Zap,
  // Wrench,
  // Droplet,
  ClipboardList,
  PlusCircle,
  Users,
  UserPlus,
  Wrench,
  TrendingUp,
  Package,
} from "lucide-react";
import type { AdminView } from "../AdminDashboard.tsx";
import type { Order, Employee, Customer, Service } from "../../types.ts";

interface DashboardHomeProps {
  orders: Order[];
  employees: Employee[];
  customers: Customer[];
  services: Service[];
  setCurrentView: (view: AdminView) => void;
}

interface DashboardServiceCardProps {
  service: Service;
  icon: React.ReactNode;
  onClick: () => void;
}
const DashboardServiceCard: React.FC<DashboardServiceCardProps> = ({
  service,
  icon,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-white p-8 group hover:shadow-2xl transition-all duration-300 border-b-[3px] border-transparent hover:border-red-600 cursor-pointer flex flex-col h-full transform hover:-translate-y-2 hover:scale-[1.02]"
  >
    <div className="flex justify-between items-start mb-6">
      <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-red-600 transition-colors">
          Service
        </span>
        <h4 className="text-xl font-bold text-brand-blue font-heading mt-1 pr-4 group-hover:text-gray-800 transition-colors">
          {service.names}
        </h4>
      </div>
    </div>

    <p className="text-gray-500 text-xs mb-6 leading-relaxed flex-1 line-clamp-3">
      {service.descriptions}
    </p>

    <div className="mt-auto flex justify-between items-end">
      <button className="text-[10px] font-bold text-brand-red uppercase tracking-wider group-hover:underline focus:outline-none text-left flex items-center gap-1">
        Read More{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:rotate-90">
          +
        </span>
      </button>
      <div className="opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 text-brand-blue group-hover:text-red-600">
        {icon}
      </div>
    </div>
  </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({
  services,
  setCurrentView,
}) => {
  const getIconForService = (index: number) => {
    const icons = [
      <TrendingUp size={40} strokeWidth={1.5} />,
      <PlusCircle size={40} strokeWidth={1.5} />,
      <ClipboardList size={40} strokeWidth={1.5} />,
      <Package size={40} strokeWidth={1.5} />,
      <UserPlus size={40} strokeWidth={1.5} />,
      <Users size={40} strokeWidth={1.5} />,
      <UserPlus size={40} strokeWidth={1.5} />,
      <Users size={40} strokeWidth={1.5} />,
      <Wrench size={40} strokeWidth={1.5} />,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="space-y-12">
      <div>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading relative inline-block">
            Admin Dashboard
            <div className="absolute -right-12 top-1/2 h-[2px] w-8 bg-brand-red"></div>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Quick access to all garage services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <DashboardServiceCard
              key={service.id}
              service={service}
              icon={getIconForService(index)}
              onClick={() => setCurrentView(service.view as AdminView)} // <-- dynamic
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
