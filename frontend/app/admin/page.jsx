"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import api from "@/lib/api";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/users/login", formData);
      const token = response.data?.data?.token;
      const isAdmin = response.data?.data?.user?.isAdmin;
      
      if (token) {
        if (isAdmin) {
          // Sign out of NextAuth so it doesn't instantly overwrite the admin token
          await signOut({ redirect: false });
          
          localStorage.setItem("token", token);
          localStorage.setItem("isAdmin", "true");
          window.location.href = "/admin/dashboard";
        } else {
          setError("Access Denied: You do not have administrator privileges.");
        }
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-width flex justify-start lg:justify-center overflow-x-hidden py-12">
      <div className="flex flex-col items-center w-full max-w-md mx-auto bg-white p-8 border border-gray-100 shadow-md rounded-md mt-12">
        
        {/* Headings */}
        <div className="w-full mb-8 text-center">
          <h1 className="text-3xl font-medium tracking-wide mb-2 text-gray-900">
            Admin Portal
          </h1>
          <p className="text-gray-500">Sign in to access the dashboard</p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500 font-medium text-left">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
              className="w-full bg-[#f5f5f5] rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500 font-medium text-left">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-[#f5f5f5] rounded-md py-3 px-4 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-left">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 mt-4 bg-[#db4444] text-white font-medium rounded-[4px] hover:bg-red-600 transition-colors disabled:bg-red-400"
          >
            {loading ? "Authenticating..." : "Admin Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
