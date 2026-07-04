"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await api.get("/users/profile");
        const user = response.data.data;
        
        // Split name into first and last
        const nameParts = (user.name || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          email: user.email || "",
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({ type: "error", text: "Failed to load profile. Please log in again." });
        if (error.response?.status === 401) {
           router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    // Validate passwords if user is trying to change it
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: "error", text: "New passwords do not match." });
        setSaving(false);
        return;
      }
      if (!formData.currentPassword) {
        setMessage({ type: "error", text: "Current password is required to set a new password." });
        setSaving(false);
        return;
      }
    }

    try {
      const updatePayload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
      };

      if (formData.newPassword) {
        updatePayload.currentPassword = formData.currentPassword;
        updatePayload.newPassword = formData.newPassword;
      }

      await api.put("/users/profile", updatePayload);
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="section-width py-20 text-center">Loading...</div>;
  }

  return (
    <main className="section-width py-[80px] text-gray-900">
      <div className="flex justify-between items-center mb-[80px]">
        <div className="text-sm text-gray-500">
          <Link href="/">Home</Link> <span className="mx-2">/</span> <span className="text-gray-900">My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-[#db4444] font-medium">{formData.firstName} {formData.lastName}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Sidebar */}
        <aside className="w-full lg:w-[250px] flex-shrink-0">
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-xl mb-4 text-gray-900">Manage My Account</h3>
            <ul className="flex flex-col gap-3 pl-2 text-gray-500">
              <li className="text-[#db4444] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#db4444]"></span>
                My Profile
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <Link href="/wishlist">
              <h3 className="font-semibold text-xl text-gray-900 hover:text-[#db4444] transition-colors cursor-pointer">My WishList</h3>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow bg-white shadow-lg shadow-gray-200/50 rounded-2xl border border-gray-100 px-8 py-10 lg:px-12 lg:py-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 border-b border-gray-100 pb-4">Edit Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {message.text && (
              <div className={`p-4 rounded-[4px] ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            {/* Profile Fields */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#DB4444]/20 focus:border-[#DB4444] transition-all duration-300 text-gray-900"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#DB4444]/20 focus:border-[#DB4444] transition-all duration-300 text-gray-900"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-6">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#DB4444]/20 focus:border-[#DB4444] transition-all duration-300 text-gray-900"
                />
              </div>
              {/* Address Field removed as requested */}
            </div>

            {/* Password Changes */}
            <div className="flex flex-col gap-5 mt-6 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Changes</h3>
              
              <input 
                type="password" 
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#DB4444]/20 focus:border-[#DB4444] transition-all duration-300 w-full text-gray-900"
              />
              <input 
                type="password" 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#DB4444]/20 focus:border-[#DB4444] transition-all duration-300 w-full text-gray-900"
              />
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#DB4444]/20 focus:border-[#DB4444] transition-all duration-300 w-full text-gray-900"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end items-center gap-6 mt-10">
              <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={saving}
                className="bg-[#db4444] text-white font-semibold px-10 py-4 rounded-lg shadow-lg shadow-red-500/20 hover:bg-red-600 hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
