import React from "react";
import { Users, ClipboardList, Wrench, TrendingUp } from "lucide-react";
import type { Order, Employee, Customer, Service } from "../../types.ts";

interface DashboardOverviewProps {
  orders: Order[];
  employees: Employee[];
  customers: Customer[];
  services: Service[];
}

const StatCard = ({
  title,
  value,
  icon,
  label,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="bg-white p-8 group hover:shadow-2xl transition-all duration-300 border-b-[3px] border-transparent hover:border-red-600 cursor-pointer flex flex-col h-full transform hover:-translate-y-2 hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-6">
      <div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-red-600 transition-colors">
          {label}
        </span>
        <h4 className="text-xl font-bold text-brand-blue font-heading mt-1 pr-4 group-hover:text-gray-800 transition-colors">
          {title}
        </h4>
      </div>
    </div>

    <div className="mb-6">
      <span className="text-5xl font-bold text-brand-blue group-hover:text-brand-red transition-colors font-heading">
        {value}
      </span>
    </div>

    <div className="mt-auto flex justify-between items-end">
      <button className="text-[10px] font-bold text-brand-red uppercase tracking-wider group-hover:underline focus:outline-none text-left flex items-center gap-1">
        View Details{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:rotate-90">
          +
        </span>
      </button>
      <div className="opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 text-brand-blue group-hover:text-red-600">
        {React.cloneElement(icon as React.ReactElement<any>, {
          size: 40,
          strokeWidth: 1.5,
        })}
      </div>
    </div>
  </div>
);

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  orders,
  employees,
  customers,
  services,
}) => {
  const pendingOrders = orders.filter(
    (o) => o.status === "Received" || o.status === "In Progress"
  ).length;

  return (
    <div className="space-y-12">
      <div className="mb-4">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading">
          System Overview 
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Key performance indicators and recent activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total Orders"
          label="Transactions"
          value={orders.length}
          icon={<ClipboardList />}
        />
        <StatCard
          title="New Pending"
          label="Action Required"
          value={pendingOrders}
          icon={<TrendingUp />}
        />
        <StatCard
          title="Team Members"
          label="Workforce"
          value={employees.length}
          icon={<Users />}
        />
        <StatCard
          title="Active Services"
          label="Operations"
          value={services.length}
          icon={<Wrench />}
        />
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-brand-blue font-heading mb-6">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => {
            const customer = customers.find((c) => c.id === order.customerId);
            return (
              <div
                key={order.id}
                className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="font-bold text-base text-brand-blue">
                    Order #{order.id} - {customer?.firstName}{" "}
                    {customer?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{order.description}</p>
                </div>
                <span
                  className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : order.status === "In Progress"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-brand-blue"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            );
          })}
          {orders.length === 0 && (
            <p className="text-gray-500 text-sm italic">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
