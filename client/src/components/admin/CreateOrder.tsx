/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/CreateOrder.tsx
import React, { useState } from "react";
import type { Customer, Vehicle, Service, Order, Employee } from "../../types";
import { Search, CheckCircle, X } from "lucide-react";
import { createOrder as createOrderAPI } from "../../api/order";

interface CreateOrderProps {
  customers: Customer[];
  vehicles: Vehicle[];
  services: Service[];
  employees: Employee[];
  onSubmit: (order: Omit<Order, "id" | "date" | "status">) => void;
  onAddVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  onAddCustomerClick: () => void; // NEW: callback to navigate to AddCustomer page
}

const CreateOrder: React.FC<CreateOrderProps> = ({
  customers,
  vehicles,
  services,
  employees,
  onSubmit,
  onAddVehicle,
  onAddCustomerClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedServices, setSelectedServices] = useState<(number | string)[]>(
    [],
  );
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Vehicle Form State
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    year: "",
    make: "",
    model: "",
    type: "",
    mileage: "",
    tag: "",
    serial: "",
    color: "",
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm),
  );

  const customerVehicles = selectedCustomer
    ? vehicles.filter((v) => v.customerId === selectedCustomer.id)
    : [];

  const handleAddVehicle = () => {
    if (selectedCustomer && newVehicle.make) {
      onAddVehicle({ ...newVehicle, customerId: selectedCustomer.id });
      setShowVehicleForm(false);
      setNewVehicle({
        year: "",
        make: "",
        model: "",
        type: "",
        mileage: "",
        tag: "",
        serial: "",
        color: "",
      });
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedCustomer || !selectedVehicle) {
      alert("Please select a customer and vehicle");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        customer_id: String(selectedCustomer.id),
        vehicle_id: String(selectedVehicle.id),
        employee_id: employees[0]?.id ? String(employees[0].id) : undefined,
        services: selectedServices.map((id) => String(id)),
        description: description || undefined,
        total_price: 0,
      };

      await createOrderAPI(orderData);

      onSubmit({
        customerId: Number(selectedCustomer.id),
        vehicleId: Number(selectedVehicle.id),
        employeeId: employees[0]?.id,
        description,
        serviceIds: selectedServices.map((id) => Number(id)),
      });

      setSelectedCustomer(null);
      setSelectedVehicle(null);
      setSelectedServices([]);
      setDescription("");
      setSearchTerm("");

      alert("Order created successfully!");
    } catch (error: any) {
      console.error("Failed to create order:", error);
      alert(
        error.response?.data?.message ||
          "Failed to create order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading relative inline-block">
          Create a new order
          <div className="absolute -right-20 top-1/2 h-0.75 w-16 bg-brand-red hidden md:block"></div>
        </h2>
      </div>

      {/* Step 1: Select Customer */}
      {!selectedCustomer && (
        <div className="bg-white p-10 rounded-lg shadow-sm space-y-8 animate-in fade-in">
          <h3 className="text-xl font-bold text-gray-700">
            1. Select Customer
          </h3>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={24}
            />
            <input
              type="text"
              placeholder="Search for a customer using first name, last name, email address or phone number"
              className="w-full pl-14 p-5 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red shadow-sm bg-white text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && (
            <div className="border border-gray-100 rounded overflow-hidden max-h-100 overflow-y-auto">
              {filteredCustomers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="p-6 hover:bg-gray-50 cursor-pointer border-b border-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-base text-brand-blue">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {c.email} | {c.phone}
                    </p>
                  </div>
                  <CheckCircle size={24} className="text-gray-300" />
                </div>
              ))}
              {filteredCustomers.length === 0 && (
                <div className="p-6 text-gray-400 italic text-sm">
                  No customers found
                </div>
              )}
            </div>
          )}

          <button
            onClick={onAddCustomerClick} // Navigate to AddCustomer page
            className="bg-brand-red text-white px-8 py-4 text-xs font-bold uppercase rounded hover:bg-red-700"
          >
            Add New Customer
          </button>
        </div>
      )}

      {/* Step 2: Customer Selected -> Select Vehicle */}
      {selectedCustomer && !selectedVehicle && (
        <div className="space-y-8 animate-in slide-in-from-right-10 fade-in">
          <div className="bg-white p-8 rounded-lg border-l-8 border-brand-red flex justify-between items-center shadow-sm">
            <div>
              <h3 className="text-2xl font-bold text-brand-blue font-heading">
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </h3>
              <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
            </div>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="text-xs text-brand-red underline font-bold"
            >
              Change Customer
            </button>
          </div>

          <div className="bg-white p-10 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg text-gray-700 mb-6">
              Choose a vehicle
            </h4>

            {customerVehicles.length > 0 ? (
              <div className="grid gap-6">
                {customerVehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className="border border-gray-200 p-6 rounded hover:border-brand-red cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-white transition-colors"
                  >
                    <div>
                      <span className="font-bold text-lg text-brand-blue block">
                        {v.year} {v.make} {v.model}
                      </span>
                      <span className="text-sm text-gray-500">
                        Tag: {v.tag} | Mileage: {v.mileage}
                      </span>
                    </div>
                    <div className="text-gray-300">
                      <CheckCircle size={28} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mb-6 text-sm">
                No vehicles found for this customer.
              </p>
            )}

            {!showVehicleForm ? (
              <button
                onClick={() => setShowVehicleForm(true)}
                className="mt-8 bg-brand-red text-white px-8 py-4 text-xs font-bold uppercase rounded hover:bg-red-700"
              >
                Add New Vehicle
              </button>
            ) : (
              <div className="mt-8 p-8 bg-gray-50 rounded border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h5 className="font-bold text-xl text-brand-blue">
                    Vehicle Details
                  </h5>
                  <button
                    onClick={() => setShowVehicleForm(false)}
                    className="hover:text-brand-red"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <input
                    placeholder="Year"
                    className="p-3 border rounded text-sm bg-white text-gray-800"
                    value={newVehicle.year}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, year: e.target.value })
                    }
                  />
                  <input
                    placeholder="Make"
                    className="p-3 border rounded text-sm bg-white text-gray-800"
                    value={newVehicle.make}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, make: e.target.value })
                    }
                  />
                  <input
                    placeholder="Model"
                    className="p-3 border rounded text-sm bg-white text-gray-800"
                    value={newVehicle.model}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, model: e.target.value })
                    }
                  />
                  <input
                    placeholder="Type"
                    className="p-3 border rounded text-sm bg-white text-gray-800"
                    value={newVehicle.type}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, type: e.target.value })
                    }
                  />
                  <input
                    placeholder="Mileage"
                    className="p-3 border rounded text-sm bg-white text-gray-800"
                    value={newVehicle.mileage}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, mileage: e.target.value })
                    }
                  />
                  <input
                    placeholder="Tag"
                    className="p-3 border rounded text-sm bg-white text-gray-800"
                    value={newVehicle.tag}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, tag: e.target.value })
                    }
                  />
                  <input
                    placeholder="Color"
                    className="p-3 border rounded text-sm bg-white text-gray-800"
                    value={newVehicle.color}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, color: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={handleAddVehicle}
                  className="bg-brand-blue text-white px-6 py-3 text-xs font-bold rounded uppercase"
                >
                  Save Vehicle
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Vehicle Selected -> Select Services */}
      {selectedCustomer && selectedVehicle && (
        <div className="space-y-8 animate-in slide-in-from-right-10 fade-in">
          <div className="flex gap-6">
            <div className="bg-white p-6 rounded-lg border-l-8 border-brand-blue shadow-sm flex-1">
              <h3 className="font-bold text-xl text-brand-blue">
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </h3>
              <p className="text-xs text-gray-500">Customer</p>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-8 border-brand-red shadow-sm flex-1">
              <h3 className="font-bold text-xl text-brand-blue">
                {selectedVehicle.year} {selectedVehicle.make}{" "}
                {selectedVehicle.model}
              </h3>
              <p className="text-xs text-gray-500">Vehicle</p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-lg shadow-sm">
            <h4 className="font-bold text-lg text-gray-700 mb-6">
              Choose services
            </h4>
            <div className="space-y-4 mb-10">
              {services.map((service) => (
                <label
                  key={service.id}
                  className="flex items-start gap-4 p-6 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-1 w-6 h-6 text-brand-red"
                    checked={selectedServices.includes(service.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedServices([...selectedServices, service.id]);
                      } else {
                        setSelectedServices(
                          selectedServices.filter((id) => id !== service.id),
                        );
                      }
                    }}
                  />
                  <div>
                    <span className="font-bold text-lg text-brand-blue block">
                      {service.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {service.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <h4 className="font-bold text-lg text-gray-700 mb-4">
              Additional requests
            </h4>
            <textarea
              className="w-full border border-gray-200 rounded p-6 text-sm focus:outline-none focus:border-brand-red mb-8 bg-white text-gray-800"
              rows={4}
              placeholder="Service description or notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className={`w-full ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-brand-red hover:bg-red-700"
              } text-white px-10 py-5 font-bold text-sm uppercase rounded shadow-md transition-colors`}
            >
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;
