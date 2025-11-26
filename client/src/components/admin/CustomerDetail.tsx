import React from "react";
import type { Customer, Order, Vehicle } from "../../types";
import {
  // ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Car,
  FileText,
  Edit,
  Tag,
  //   CheckCircle,
} from "lucide-react";

interface CustomerDetailProps {
  customer: Customer;
  orders: Order[];
  vehicles: Vehicle[];
  onBack: () => void;
  onEdit: (customer: Customer) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({
  customer,
  orders,
  vehicles,
  // onBack,
  onEdit,
}) => {
  // Filter data specifically for this customer just in case, though parent should pass filtered data
  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const customerVehicles = vehicles.filter((v) => v.customerId === customer.id);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
      {/* Header / Back Button */}
      <div className="flex items-center gap-4">
        {/* <button
          onClick={onBack}
          className="p-2 rounded-full bg-white text-brand-blue hover:text-brand-blue hover:bg-gray-100 transition-colors shadow-sm"
        >
          <ArrowLeft size={24} />
        </button> */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading relative inline-block">
            Customer Details
            <div className="absolute -right-20 top-1/2 h-[3px] w-16 bg-brand-red hidden md:block"></div>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Viewing profile for {customer.firstName} {customer.lastName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white  rounded-xl shadow-sm border-l-4 border-b-4 border-brand-red overflow-hidden">
            <div className="bg-brand-blue h-24 relative">
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-brand-red text-white flex items-center justify-center text-3xl font-bold font-heading">
                    {customer.firstName.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-12 pb-6 px-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-brand-blue dark:text-white">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      customer.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {customer.active ? "Active Customer" : "Inactive"}
                  </span>
                </div>
                <button
                  onClick={() => onEdit(customer)}
                  className="text-brand-blue hover:text-brand-blue dark:hover:text-white transition-colors"
                >
                  <Edit size={18} />
                </button>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-brand-blue font-bold">
                  <Mail size={18} className="text-brand-blue" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-brand-blue font-bold">
                  <Phone size={18} className="text-brand-blue" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-brand-blue font-bold">
                  <Calendar size={18} className="text-brand-blue" />
                  <span className="text-sm">
                    Member since {customer.addedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-b-4 border-brand-red  text-center">
              <div className="text-brand-blue mb-2 flex justify-center">
                <Car size={32} />
              </div>
              <p className="text-3xl font-bold text-brand-blue">
                {customerVehicles.length}
              </p>
              <p className="text-xs text-brand-blue uppercase font-bold tracking-wider">
                Vehicles
              </p>
            </div>
            <div className="bg-white  p-6 rounded-lg shadow-sm border-l-4 border-b-4 border-brand-red  text-center">
              <div className="text-brand-blue dark:text-blue-400 mb-2 flex justify-center">
                <FileText size={32} />
              </div>
              <p className="text-3xl font-bold text-brand-blue">
                {customerOrders.length}
              </p>
              <p className="text-xs text-brand-blue uppercase font-bold tracking-wider">
                Orders
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Vehicles & Orders */}
        <div className="lg:col-span-2 space-y-8">
          {/* Vehicles Section */}
          <div className="bg-white  rounded-xl shadow-sm border-l-4 border-b-4 border-brand-red  p-6">
            <h3 className="text-lg font-bold text-brand-blue dark:text-white mb-4 flex items-center gap-2">
              <Car size={32} className="text-brand-blue" /> Vehicles Owned
            </h3>

            <div className="space-y-4">
              {customerVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4  rounded-lg  group hover:border-brand-blue/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-brand-blue dark:text-white">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </span>
                      <span className="text-3xs  font-bold text-brand-blue px-2 py-0.5 rounded">
                        {vehicle.type}
                      </span>
                    </div>
                    <div className="font-bold flex items-center gap-4 mt-1 text-2xs text-brand-blue">
                      <span className="flex items-center gap-1">
                        <Tag size={14} /> Tag: {vehicle.tag}
                      </span>
                      <span>Mileage: {vehicle.mileage}</span>
                      <span>Color: {vehicle.color}</span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <span className="text-2xs font-bold text-brand-blue font-mono">
                      VIN: {vehicle.serial}
                    </span>
                  </div>
                </div>
              ))}
              {customerVehicles.length === 0 && (
                <div className="text-center py-8 text-gray-400 italic text-sm">
                  No vehicles registered.
                </div>
              )}
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-xl shadow-sm border-l-4 border-b-4 border-brand-red  p-6">
            <h3 className="text-lg font-bold text-brand-blue dark:text-white mb-4 flex items-center gap-2">
              <FileText
                size={32}
                className="text-brand-blue dark:text-blue-400"
              />{" "}
              Service History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-brand-blue dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 rounded-l-md">Order ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-md">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {customerOrders.map((order) => {
                    const vehicle = vehicles.find(
                      (v) => v.id === order.vehicleId
                    );
                    return (
                      <tr key={order.id} className="transition-colors">
                        <td className="px-4 py-3 font-bold text-brand-blue">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3 text-brand-blue font-bold">
                          {order.date}
                        </td>
                        <td className="px-4 py-3 text-brand-blue font-bold">
                          {vehicle?.make} {vehicle?.model}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : order.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 text-brand-blue font-bold max-w-xs truncate"
                          title={order.description}
                        >
                          {order.description}
                        </td>
                      </tr>
                    );
                  })}
                  {customerOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-400 italic"
                      >
                        No service orders found.
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

export default CustomerDetail;
