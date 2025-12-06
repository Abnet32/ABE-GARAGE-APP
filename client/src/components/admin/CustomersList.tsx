/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import type { Customer } from "../../types.ts";
import { Edit, ExternalLink, Search, CheckCircle } from "lucide-react";
import { getCustomers } from "../../api/Customer.ts";

interface CustomersListProps {
  customers: Customer[];
  onEdit: (cust: Customer) => void;
  onDelete: (id: number) => void;
  onView: (cust: Customer) => void;
}

const CustomersList: React.FC<CustomersListProps> = ({ onEdit, onView }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();

      const sorted = [...data].sort((a, b) => {
        const dateA = a.addedDate ? new Date(a.addedDate).getTime() : 0;
        const dateB = b.addedDate ? new Date(b.addedDate).getTime() : 0;
        return dateB - dateA;
      });

      setCustomers(sorted);
      setLoading(false);
    } catch (err) {
      setError("Failed to load customers");
      setLoading(false);
    }
  };
  fetchData();
}, []);



  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const isSearching = searchTerm.trim().length > 0;

  if (loading) return <p className="text-center py-10">Loading customers...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-heading relative inline-block">
          Customers
          <div className="absolute -right-20 top-1/2 h-[3px] w-16 bg-brand-red hidden md:block"></div>
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
        <div className="border border-gray-100 rounded overflow-hidden max-h-[400px] overflow-y-auto mt-4">
          {filteredCustomers.map((c) => (
            <div
              key={c.id}
              onClick={() => onView(c)}
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

      {/* Table */}
      {!isSearching && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-700">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">First Name</th>
                  <th className="px-6 py-4">Last Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Active</th>
                  <th className="px-6 py-4">Edit/View</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold">
                      ..{String(cust.id).slice(-2)}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-blue">
                      {cust.firstName}
                    </td>
                    <td className="px-6 py-4">{cust.lastName}</td>
                    <td className="px-6 py-4">{cust.email}</td>
                    <td className="px-6 py-4">{cust.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          cust.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {cust.active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => onEdit(cust)}
                        className="text-gray-400 hover:text-brand-blue transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onView(cust)}
                        className="text-gray-400 hover:text-brand-blue"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {customers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500 italic"
                    >
                      No customers found
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

export default CustomersList;
