import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

interface LoginProps {
  onLogin: (token: string, role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<"admin" | "employee" | "customer">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;

      if (role === "admin") {
        // Admin login (email + password)
        response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        });
      } else if (role === "employee") {
        // Employee login (email + phone)
        response = await axios.post(`${API_BASE_URL}/employees/login`, {
          email,
          phone,
        });
      } else if (role === "customer") {
        // Customer login (email + phone)
        response = await axios.post(`${API_BASE_URL}/customers/login`, {
          email,
          phone,
        });
      }

      const data = response?.data;
      onLogin(data.token, role);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white min-h-[600px] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-brand-blue font-heading mb-4 relative inline-block">
            <div className="absolute -left-12 top-1/2 h-[4px] w-8 bg-brand-red"></div>
            Login to your account
            <div className="absolute -right-12 top-1/2 h-[4px] w-8 bg-brand-red"></div>
          </h2>
          <p className="text-gray-400 text-xs">Select your role and login</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100"
        >
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "admin" | "employee" | "customer")
              }
              className="w-full p-4 border border-gray-200 text-sm focus:outline-none focus:border-brand-red transition-colors rounded bg-white text-gray-800"
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-200 text-sm focus:outline-none focus:border-brand-red transition-colors rounded bg-white text-gray-800"
              required
            />
          </div>

          {/* Conditional Fields */}
          {role === "admin" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-200 text-sm focus:outline-none focus:border-brand-red transition-colors rounded bg-white text-gray-800"
                required
              />
            </div>
          )}

          {(role === "employee" || role === "customer") && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g., 555-1234"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 border border-gray-200 text-sm focus:outline-none focus:border-brand-red transition-colors rounded bg-white text-gray-800"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red text-white px-10 py-4 text-sm font-bold tracking-widest hover:bg-red-700 transition-colors uppercase rounded disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
