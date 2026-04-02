/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import type { Customer } from "../../types";
import { addCustomer, updateCustomer } from "../../api/Customer";

interface AddCustomerProps {
  onSubmit: (customer: Omit<Customer, "id" | "addedDate">) => void;
  initialData?: Customer;
  isEditing?: boolean;
}

const AddCustomer: React.FC<AddCustomerProps> = ({
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    active: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        active: initialData.active,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && initialData) {
        await updateCustomer(String(initialData.id), formData); // convert id to string for API
        alert("Customer updated successfully!");
      } else {
        await addCustomer(formData);
        alert("Customer added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          active: true,
        });
      }
    } catch (err: unknown) {
      // support Axios-like error objects with a response, standard Error instances, and other values
      if (typeof err === "object" && err !== null && "response" in err) {
        const anyErr = err as any;
        alert(
          anyErr.response?.data?.message ??
            anyErr.message ??
            "Error adding customer",
        );
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(String(err) || "Error adding customer");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading relative inline-block">
          {isEditing
            ? `Edit: ${formData.firstName} ${formData.lastName}`
            : "Add a new customer"}
          <div className="absolute -right-20 top-1/2 h-0.75 w-16 bg-brand-red hidden md:block"></div>
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 shadow-sm rounded-lg space-y-8"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Customer Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Customer email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red bg-white text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Customer first name"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red bg-white text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Customer last name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red bg-white text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Customer phone (555-555-5555)"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red bg-white text-gray-800"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              id="cust-active"
              className="w-5 h-5 text-brand-red"
            />
            <label htmlFor="cust-active" className="text-sm text-gray-600">
              Is active customer
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-brand-red text-white px-10 py-4 font-bold text-sm uppercase rounded shadow-md hover:bg-red-700 transition-colors"
        >
          {isEditing ? "Update" : "Add Customer"}
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;
