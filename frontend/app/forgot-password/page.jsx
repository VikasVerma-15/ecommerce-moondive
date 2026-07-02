"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/change-password", {
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success("Password changed successfully! Please log in.");
      router.push("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to change password. Please check your current password and try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-width flex justify-center py-20 px-4 xl:px-0">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100 mt-20">
        <h1 className="text-3xl font-medium tracking-wide mb-2 text-center text-gray-900">
          Change Password
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your current password to update it to a new one.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full h-[50px] border-b border-gray-300 bg-transparent focus:outline-none focus:border-[#DB4444] transition-colors"
              disabled={loading}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Previous Password"
              className="w-full h-[50px] border-b border-gray-300 bg-transparent focus:outline-none focus:border-[#DB4444] transition-colors"
              disabled={loading}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full h-[50px] border-b border-gray-300 bg-transparent focus:outline-none focus:border-[#DB4444] transition-colors"
              disabled={loading}
              required
              minLength={6}
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter New Password Again"
              className="w-full h-[50px] border-b border-gray-300 bg-transparent focus:outline-none focus:border-[#DB4444] transition-colors"
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] bg-[#DB4444] text-white rounded-[4px] font-medium hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center justify-center mt-4"
          >
            {loading ? "Updating..." : "Submit"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link href="/login" className="text-gray-600 hover:text-[#DB4444] transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
