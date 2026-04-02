import React, { useState } from "react";
import type { Order, Customer, Vehicle, Employee } from "../../types";
import { Edit, ExternalLink } from "lucide-react";
import { updateOrderStatus as updateOrderStatusAPI } from "../../api/order";

interface OrdersListProps {
  orders: Order[];
  customers: Customer[];
  vehicles: Vehicle[];
  employees: Employee[];
  onEdit: (order: Order) => void;
  onUpdateStatus: (id: number, status: Order["status"]) => void;
  onViewCustomer: (customer: Customer) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  customers,
  vehicles,
  employees,
  onEdit,
  onUpdateStatus,
  onViewCustomer,
}) => {
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const handleStatusUpdate = async (
    orderId: number | string,
    currentStatus: Order["status"],
  ) => {
    const nextStatus =
      currentStatus === "Received"
        ? "In Progress"
        : currentStatus === "In Progress"
          ? "Completed"
          : "Received";

    setUpdatingStatus(Number(orderId));
    try {
      await updateOrderStatusAPI(String(orderId), nextStatus);
      // Call parent callback to update local state
      onUpdateStatus(Number(orderId), nextStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading relative inline-block">
          Orders
          <div className="absolute -right-20 top-1/2 h-0.75 w-16 bg-brand-red hidden md:block"></div>
        </h2>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700">
              <tr>
                <th className="px-6 py-4">Order Id</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Order Date</th>
                <th className="px-6 py-4">Received By</th>
                <th className="px-6 py-4">Order status</th>
                <th className="px-6 py-4">View/Edit</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const customer = customers.find(
                  (c) => c.id === order.customerId,
                );
                const vehicle = vehicles.find((v) => v.id === order.vehicleId);
                const employee = employees.find(
                  (e) => e.id === order.employeeId,
                );

                return (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {String(order.id).slice(-2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-blue">
                        {customer?.firstName} {customer?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {customer?.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {customer?.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-700">
                        {vehicle?.make} {vehicle?.model}
                      </div>
                      <div className="text-xs text-gray-500">
                        {vehicle?.year} - {vehicle?.tag}
                      </div>
                    </td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4">
                      {employee
                        ? `${employee.firstName} ${employee.lastName}`
                        : "Unassigned"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        onClick={() => {
                          if (updatingStatus === order.id) return;
                          handleStatusUpdate(order.id, order.status);
                        }}
                        className={`cursor-pointer px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          updatingStatus === order.id
                            ? "bg-gray-300 text-gray-600 cursor-wait"
                            : order.status === "Completed"
                              ? "bg-green-500 text-white"
                              : order.status === "In Progress"
                                ? "bg-red-400 text-brand-blue"
                                : "bg-gray-500 text-white"
                        }`}
                      >
                        {updatingStatus === order.id
                          ? "Updating..."
                          : order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => onEdit(order)}
                        className="text-gray-400 hover:text-brand-blue"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (customer) onViewCustomer(customer);
                        }}
                        className="text-gray-400 hover:text-brand-blue"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500 italic"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
