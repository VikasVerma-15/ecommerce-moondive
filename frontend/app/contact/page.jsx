"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      toast.error("Please log in first to send a message.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/contacts", formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send message. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-width py-12 px-4 xl:px-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-12">
        <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
          Home
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-900 font-medium">Contact</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Contact Info */}
        <div className="w-full lg:w-[30%] bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-8 flex flex-col gap-8">
          
          {/* Call To Us */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#db4444] flex items-center justify-center text-white">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Call To Us</h3>
            </div>
            <div className="flex flex-col gap-4 text-sm text-gray-900">
              <p>We are available 24/7, 7 days a week.</p>
              <p>Phone: 1234567890</p>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Write To Us */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#db4444] flex items-center justify-center text-white">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Write To US</h3>
            </div>
            <div className="flex flex-col gap-4 text-sm text-gray-900">
              <p>Fill out our form and we will contact you within 24 hours.</p>
              <p>Emails: customer@exclusive.com</p>
              <p>Emails: support@exclusive.com</p>
            </div>
          </div>

        </div>

        {/* Right Side: Contact Form */}
        <div className="w-full lg:w-[70%] bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 h-full">
            
            {/* Top Row Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name *" 
                required 
                className="w-full bg-[#f5f5f5] hover:bg-gray-100 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-[#DB4444] focus:bg-white transition-all duration-300 shadow-inner text-sm"
              />
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email *" 
                required 
                className="w-full bg-[#f5f5f5] hover:bg-gray-100 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-[#DB4444] focus:bg-white transition-all duration-300 shadow-inner text-sm"
              />
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone *" 
                required 
                className="w-full bg-[#f5f5f5] hover:bg-gray-100 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-[#DB4444] focus:bg-white transition-all duration-300 shadow-inner text-sm"
              />
            </div>

            {/* Message Textarea */}
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message" 
              required
              className="w-full bg-[#f5f5f5] hover:bg-gray-100 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-[#DB4444] focus:bg-white transition-all duration-300 shadow-inner min-h-[250px] resize-y text-sm flex-grow"
            ></textarea>

            {/* Submit Button */}
            <div className="flex justify-end mt-auto">
              <button 
                type="submit" 
                disabled={loading}
                className="px-12 py-4 bg-[#db4444] text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-red-600 hover:-translate-y-1 transition-all duration-300 disabled:bg-red-400 disabled:shadow-none disabled:transform-none"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </main>
  );
}
