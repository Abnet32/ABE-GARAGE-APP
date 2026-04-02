import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { loginUser } from "../api/Auth";

interface LoginProps {
  onLogin: (token: string, role: string, userId?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (!data?.token) {
        throw new Error("Invalid login response from server");
      }

      onLogin(data.token, data.role || "admin", data.userId);
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
    <section className="py-20 bg-white min-h-150 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-brand-blue font-heading mb-4 relative inline-block">
            <div className="absolute -left-12 top-1/2 h-1 w-8 bg-brand-red"></div>
            Login to your account
            <div className="absolute -right-12 top-1/2 h-1 w-8 bg-brand-red"></div>
          </h2>
          <p className="text-gray-400 text-xs">
            Use your admin email and password
          </p>
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

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pr-12 border border-gray-200 text-sm focus:outline-none focus:border-brand-red transition-colors rounded bg-white text-gray-800"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

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
