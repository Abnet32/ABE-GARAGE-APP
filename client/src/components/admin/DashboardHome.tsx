// src/components/admin/DashboardHome.tsx
import React from "react";
import {
  ClipboardList,
  PlusCircle,
  Users,
  UserPlus,
  Wrench,
  TrendingUp,
  Package,
} from "lucide-react";
import type { AdminView } from "../../types";

// ---------------- TYPES ----------------
export interface DashboardItem {
  id: string;
  name: string;
  description: string;
  type:
    | "Orders"
    | "Employees"
    | "Customers"
    | "Services"
    | "Inventory"
    | "NewOrder"
    | "NewEmployee"
    | "NewCustomer"
    | "Overview";
  count?: number;
}

interface DashboardHomeProps {
  setCurrentView: (view: AdminView) => void;
}

// ---------------- CARD ----------------
interface DashboardServiceCardProps {
  service: DashboardItem;
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
    className="bg-white p-6 group hover:shadow-2xl transition-all duration-300 border-b-[3px] border-transparent hover:border-red-600 cursor-pointer flex flex-col h-full transform hover:-translate-y-2 hover:scale-[1.02]"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-red-600 transition-colors">
          {service.type}
        </span>
        <h4 className="text-xl font-bold text-brand-blue mt-1 pr-4 group-hover:text-gray-800 transition-colors">
          {service.name}
        </h4>
        {/* {service.count !== undefined && (
          <p className="text-gray-500 text-sm mt-1">{service.count} items</p>
        )} */}
      </div>
      <div className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 text-brand-blue group-hover:text-red-600">
        {icon}
      </div>
    </div>

    <p className="text-gray-500 text-xs mb-4 leading-relaxed flex-1 line-clamp-3">
      {service.description}
    </p>

    <div className="mt-auto flex justify-between items-end">
      <button className="text-[10px] font-bold text-brand-red uppercase tracking-wider group-hover:underline flex items-center gap-1">
        Read More{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:rotate-90">
          +
        </span>
      </button>
    </div>
  </div>
);

// ---------------- DASHBOARD HOME ----------------
const DashboardHome: React.FC<DashboardHomeProps> = ({ setCurrentView }) => {
  const dashboardItems: DashboardItem[] = [
    {
      id: "overview",
      name: "Overview",
      description: "Check dashboard statistics at a glance.",
      type: "Overview",
    },
    {
      id: "new-order",
      name: "Add New Order",
      description: "Quickly create a new order for a customer.",
      type: "NewOrder",
    },
    {
      id: "orders",
      name: "All Orders",
      description: "View all orders in your garage.",
      type: "Orders",
    },
    {
      id: "new-employee",
      name: "Add New Employee",
      description: "Quickly add a new employee.",
      type: "NewEmployee",
    },
    {
      id: "employees",
      name: "All Employees",
      description: "Manage your garage staff.",
      type: "Employees",
    },

    {
      id: "new-customer",
      name: "Add New Customer",
      description: "Quickly add a new customer.",
      type: "NewCustomer",
    },
    {
      id: "customers",
      name: "All Customers",
      description: "View and manage all customers.",
      type: "Customers",
    },
    {
      id: "services",
      name: "All Services",
      description: "View and manage all services.",
      type: "Services",
    },
    {
      id: "inventory",
      name: "Inventory",
      description: "Track all inventory items.",
      type: "Inventory",
    },
  ];

  const getIconForType = (type: DashboardItem["type"]) => {
    switch (type) {
      case "Orders":
        return <ClipboardList size={40} strokeWidth={1.5} />;
      case "Employees":
        return <Users size={40} strokeWidth={1.5} />;
      case "Customers":
        return <UserPlus size={40} strokeWidth={1.5} />;
      case "Services":
        return <Wrench size={40} strokeWidth={1.5} />;
      case "Inventory":
        return <Package size={40} strokeWidth={1.5} />;
      case "NewOrder":
        return <PlusCircle size={40} strokeWidth={1.5} />;
      case "NewEmployee":
        return <UserPlus size={40} strokeWidth={1.5} />;
      case "NewCustomer":
        return <Users size={40} strokeWidth={1.5} />;
      case "Overview":
        return <TrendingUp size={40} strokeWidth={1.5} />;
      default:
        return <TrendingUp size={40} strokeWidth={1.5} />;
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue relative inline-block">
            Admin Dashboard
            <div className="absolute -right-12 top-1/2 h-[2px] w-8 bg-red-600"></div>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Quick access to all garage services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardItems.map((item) => (
            <DashboardServiceCard
              key={item.id}
              service={item}
              icon={getIconForType(item.type)}
              onClick={() => {
                // Map DashboardItem type to AdminView
                switch (item.type) {
                  case "NewOrder":
                    setCurrentView("new-order");
                    break;
                  case "Orders":
                    setCurrentView("orders");
                    break;
                  case "NewEmployee":
                    setCurrentView("add-employee");
                    break;
                  case "Employees":
                    setCurrentView("employees");
                    break;
                  case "NewCustomer":
                    setCurrentView("add-customer");
                    break;
                  case "Customers":
                    setCurrentView("customers");
                    break;
                  case "Services":
                    setCurrentView("services");
                    break;
                  case "Inventory":
                    setCurrentView("inventory");
                    break;
                  case "Overview":
                    setCurrentView("overview");
                    break;
                  default:
                    setCurrentView("dashboard");
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
