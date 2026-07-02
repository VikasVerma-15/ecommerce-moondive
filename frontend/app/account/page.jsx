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

      <div className="flex flex-col lg:flex-row gap-[100px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-[250px] flex-shrink-0">
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-4">Manage My Account</h3>
            <ul className="flex flex-col gap-2 pl-6 text-gray-500">
              <li className="text-[#db4444] font-medium">My Profile</li>
              {/* Address Book removed as requested */}
              <li className="hover:text-gray-900 cursor-pointer transition-colors">My Payment Options</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-4">My Orders</h3>
            <ul className="flex flex-col gap-2 pl-6 text-gray-500">
              <li className="hover:text-gray-900 cursor-pointer transition-colors">My Returns</li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">My Cancellations</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">My WishList</h3>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-[4px] px-[40px] py-[40px] lg:px-[80px]">
          <h2 className="text-2xl font-medium text-[#db4444] mb-8">Edit Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {message.text && (
              <div className={`p-4 rounded-[4px] ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            {/* Profile Fields */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="bg-[#f5f5f5] rounded-[4px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="bg-[#f5f5f5] rounded-[4px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-[#f5f5f5] rounded-[4px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
              {/* Address Field removed as requested */}
            </div>

            {/* Password Changes */}
            <div className="flex flex-col gap-6 mt-4">
              <h3 className="text-sm font-medium">Password Changes</h3>
              
              <input 
                type="password" 
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="bg-[#f5f5f5] rounded-[4px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
              />
              <input 
                type="password" 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="bg-[#f5f5f5] rounded-[4px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
              />
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
                className="bg-[#f5f5f5] rounded-[4px] px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end items-center gap-8 mt-6">
              <Link href="/" className="text-gray-900 hover:text-gray-600 transition-colors">
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={saving}
                className="bg-[#db4444] text-white font-medium px-12 py-4 rounded-[4px] hover:bg-red-600 transition-colors disabled:bg-red-400"
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
