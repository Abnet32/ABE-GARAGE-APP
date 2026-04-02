import React from "react";
import type { Employee, Order, Vehicle, Customer } from "../../types";

import { Phone, Mail, Calendar, FileText, User, Edit } from "lucide-react";

interface EmployeeDetailProps {
  employee: Employee;
  orders: Order[];
  vehicles: Vehicle[];
  customers: Customer[];
  // onBack: () => void;
  onEdit: (employee: Employee) => void;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  employee,
  orders,
  vehicles,
  customers,
  // onBack,
  onEdit,
}) => {
  const employeeOrders = orders.filter((o) => o.employeeId === employee.id);

  const dateObj = new Date(employee.addedDate);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        {/* <button
          onClick={onBack}
          className="p-2 rounded-full bg-white shadow-sm text-brand-blue hover:bg-gray-100"
        >
          ←
        </button> */}

        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading relative inline-block">
            Employee Details
            <div className="absolute -right-20 top-1/2 h-0.75 w-16 bg-brand-red hidden md:block"></div>
          </h2>
          <p className="text-sm text-gray-500">
            Viewing profile for {employee.firstName} {employee.lastName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column – Profile */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border-r-4 border-b-4 border-red-500 overflow-hidden">
            <div className="bg-brand-blue h-24 relative">
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-brand-red text-white flex items-center justify-center text-3xl font-bold">
                    {employee.firstName.charAt(0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 pb-6 px-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-brand-blue">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-blue-100 text-blue-700">
                    {employee.role}
                  </span>
                </div>

                <button
                  onClick={() => onEdit(employee)}
                  className="text-brand-blue hover:text-brand-red transition"
                >
                  <Edit size={18} />
                </button>
              </div>

              <div className="mt-8 space-y-4 font-bold">
                <div className="flex items-center gap-3 text-brand-blue">
                  <Mail size={18} />{" "}
                  <span className="text-sm">{employee.email}</span>
                </div>

                <div className="flex items-center gap-3 text-brand-blue">
                  <Phone size={18} />{" "}
                  <span className="text-sm">{employee.phone}</span>
                </div>

                <div className="flex items-center gap-3 text-brand-blue">
                  <Calendar size={18} />{" "}
                  <span className="text-sm">Joined {formattedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border-r-4 border-b-4 border-red-500 text-center">
              <div className="text-brand-blue mb-2 flex justify-center">
                <FileText size={32} />
              </div>
              <p className="text-3xl font-bold text-brand-blue">
                {employeeOrders.length}
              </p>
              <p className="text-xs uppercase font-bold text-brand-blue tracking-wider">
                Orders Assigned
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-r-4 border-b-4 border-red-500 text-center">
              <div className="text-brand-blue mb-2 flex justify-center">
                <User size={32} />
              </div>
              <p className="text-3xl font-bold text-brand-blue">
                {employee.active ? "Yes" : "No"}
              </p>
              <p className="text-xs uppercase font-bold text-brand-blue tracking-wider">
                Active Status
              </p>
            </div>
          </div>
        </div>

        {/* Right Column – Orders */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border-r-4 border-b-4 border-red-500 p-6">
            <h3 className="text-lg font-bold text-brand-blue mb-4 flex items-center gap-2">
              <FileText size={32} className="text-brand-blue" /> Assigned Orders
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-brand-blue">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {employeeOrders.map((order) => {
                    const vehicle = vehicles.find(
                      (v) => v.id === order.vehicleId
                    );
                    const customer = customers.find(
                      (c) => c.id === order.customerId
                    );

                    return (
                      <tr key={order.id}>
                        <td className="px-4 py-3 font-bold text-brand-blue">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3 font-bold text-brand-blue">
                          {customer?.firstName} {customer?.lastName}
                        </td>
                        <td className="px-4 py-3 font-bold text-brand-blue">
                          {vehicle?.make} {vehicle?.model}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium
                              ${
                                order.status === "Completed"
                                  ? "bg-green-100 text-green-600"
                                  : order.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                              }
                            `}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-brand-blue font-bold max-w-xs truncate">
                          {order.description}
                        </td>
                      </tr>
                    );
                  })}

                  {employeeOrders.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-8 text-center text-gray-400 italic"
                        colSpan={5}
                      >
                        No orders assigned to this employee.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
