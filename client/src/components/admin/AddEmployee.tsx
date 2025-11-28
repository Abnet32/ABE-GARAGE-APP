import React, { useState, useEffect } from "react";
import type { Employee } from "../../types.ts";
import { AlertCircle } from "lucide-react";
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../api/employee.ts";
interface AddEmployeeProps {
  onSubmit: (employee: Employee) => void;
  initialData?: Employee & { id?: string };
  isEditing?: boolean;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<EmployeeData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Employee",
    password: "",
    active: true,
  });

  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        role: initialData.role,
        password: "",
        active: initialData.active,
      });
    }
  }, [initialData]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) => /^\+?[\d\s-()]{10,}$/.test(phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; phone?: string } = {};
    let isValid = true;

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    } 

    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (min 10 digits).";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "email" || name === "phone") {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

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
            : "Add a new employee"}
          <div className="absolute -right-20 top-1/2 h-[3px] w-16 bg-brand-red hidden md:block"></div>
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 shadow-sm rounded-lg space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Employee Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Employee email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-4 border rounded text-sm focus:outline-none bg-white text-gray-800 transition-colors ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-red"
              }`}
            />
            {errors.email && (
              <div className="flex items-center gap-1 text-red-500 mt-2">
                <AlertCircle size={14} />
                <span className="text-xs">{errors.email}</span>
              </div>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Employee first name"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red bg-white text-gray-800"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Employee last name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red bg-white text-gray-800"
            />
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Employee phone (e.g. +251 911 123 456)"
              required
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-4 border rounded text-sm focus:outline-none bg-white text-gray-800 transition-colors ${
                errors.phone
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-red"
              }`}
            />
            {errors.phone && (
              <div className="flex items-center gap-1 text-red-500 mt-2">
                <AlertCircle size={14} />
                <span className="text-xs">{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Role */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red bg-white text-gray-800"
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Password */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder={
                isEditing
                  ? "Leave blank to keep current password"
                  : "Employee password"
              }
              required={!isEditing}
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red bg-white text-gray-800"
            />
          </div>

          {/* Active */}
          <div className="md:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              id="active"
              className="w-5 h-5 text-brand-red"
            />
            <label htmlFor="active" className="text-sm text-gray-600">
              Is active employee
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-brand-red text-white px-10 py-4 font-bold text-sm uppercase rounded shadow-md hover:bg-red-700 transition-colors"
        >
          {isEditing ? "Update" : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
