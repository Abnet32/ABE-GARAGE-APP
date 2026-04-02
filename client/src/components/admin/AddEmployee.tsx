import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  type EmployeeData,
} from "../../api/employee";

interface AddEmployeeProps {
  initialData?: EmployeeData & { id?: string };
  isEditing?: boolean;
  onDone: () => void; // Refresh and go back
}

const AddEmployee: React.FC<AddEmployeeProps> = ({
  initialData,
  isEditing = false,
  onDone,
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

  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [loading, setLoading] = useState(false);

  // Load data if editing
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
      if (initialData.id) setEmployeeId(initialData.id);
    }
  }, [initialData]);

  // Validation
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) => /^\+?[\d\s-()]{10,}$/.test(phone);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; phone?: string } = {};
    let isValid = true;

    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be at least 10 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    setLoading(true);

    try {
      if (isEditing && employeeId) {
        await updateEmployee(employeeId, formData);
        console.log("Employee updated");
      } else {
        await addEmployee(formData);
        console.log("Employee added");
      }

      onDone(); // refresh parent
    } catch (err) {
      console.error("Failed to submit employee:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const handleDelete = async () => {
    if (!employeeId) return;

    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await deleteEmployee(employeeId);
      onDone();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Form Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (name === "email" || name === "phone") {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-3xl font-bold mb-6">
        {isEditing ? "Edit Employee" : "Add Employee"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 shadow rounded"
      >
        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {errors.email}
            </p>
          )}
        </div>

        {/* First Name */}
        <div>
          <label className="block font-semibold mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block font-semibold mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-3 border rounded ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {errors.phone}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block font-semibold mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder={isEditing ? "Leave empty to keep same password" : ""}
            required={!isEditing}
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          <label>Active employee</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-red text-white px-6 py-3 rounded font-semibold hover:bg-red-700"
          >
            {loading
              ? "Saving..."
              : isEditing
                ? "Update Employee"
                : "Add Employee"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-500 font-semibold hover:text-red-700"
            >
              Delete Employee
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
