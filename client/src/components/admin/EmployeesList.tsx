import React, { useState, useEffect } from "react";
import { Edit, Search, CheckCircle, ExternalLink } from "lucide-react";
import type { Employee } from "../../types";
import { getEmployees } from "../../api/employee";

interface EmployeesListProps {
  // employees: (EmployeeData & { id: string; addedDate: string })[];
  onEdit: (employee: Employee) => void;
  onView: (customer: Employee) => void;
  onDelete?: (id: string | number) => void;
  // onDelete: (id: string) => void;
}

const EmployeesList: React.FC<EmployeesListProps> = ({
  // employees,
  onEdit,
  onView,
  // onDelete,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEmployees();

        const sorted = [...data].sort((a, b) => {
          const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
          const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
          return dateB - dateA;
        });

        setEmployees(sorted);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to load Employees");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEmployees = employees.filter(
    (c) =>
      c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm),
  );

  const isSearching = searchTerm.trim().length > 0;

  if (loading) return <p className="text-center py-10">Loading Employees...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading relative inline-block">
          Employees
          <div className="absolute -right-20 top-1/2 h-0.75 w-16 bg-brand-red hidden md:block"></div>
        </h2>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={24}
        />
        <input
          type="text"
          placeholder="Search by first name, last name, email, or phone"
          className="w-full pl-14 p-5 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red shadow-sm bg-white text-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Search Results */}
      {isSearching && (
        <div className="border border-gray-100 rounded overflow-hidden max-h-100 overflow-y-auto mt-4">
          {filteredEmployees.map((e) => (
            <div
              key={e.id}
              // onClick={() => !isSearching}   i must implement detail employee page to see employee profile of individual
              onClick={() => onView(e)}
              className="p-6 hover:bg-gray-50 cursor-pointer border-b border-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-base text-brand-blue">
                  {e.firstName} {e.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {e.email} | {e.phone}
                </p>
              </div>
              <CheckCircle size={24} className="text-gray-300" />
            </div>
          ))}

          {filteredEmployees.length === 0 && (
            <div className="p-6 text-gray-400 italic text-sm">
              No customers found
            </div>
          )}
        </div>
      )}

      {/* Table */}
      {!isSearching && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700">
                <tr>
                  <th className="px-6 py-4">Active</th>
                  <th className="px-6 py-4">First Name</th>
                  <th className="px-6 py-4">Last Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  {/* <th className="px-6 py-4">Added Date</th> */}
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          emp.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-blue">
                      {emp.firstName}
                    </td>
                    <td className="px-6 py-4">{emp.lastName}</td>
                    <td className="px-6 py-4">{emp.email}</td>
                    <td className="px-6 py-4">{emp.phone}</td>
                    {/* <td className="px-6 py-4">{emp.addedDate}</td> */}
                    <td className="px-6 py-4 font-bold text-gray-700">
                      {emp.role}
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => onEdit(emp)}
                        className="text-gray-400 hover:text-brand-blue transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      {/* <button
                        onClick={() => onDelete(emp.id)}
                        className="text-gray-400 hover:text-brand-red transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button> */}
                      <button
                        onClick={() => onView(emp)}
                        className="text-gray-400 hover:text-brand-blue"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500 italic"
                    >
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesList;
