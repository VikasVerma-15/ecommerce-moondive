"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function LoginPage() {
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
      // Backend returns response.data.data.token based on user.controller.js ApiResponse
      const token = response.data?.data?.token;
      const isAdmin = response.data?.data?.user?.isAdmin;
      
      if (token) {
        localStorage.setItem("token", token);
        if (isAdmin) {
          localStorage.setItem("isAdmin", "true");
        }
        toast.success("Logged in successfully!");
        // Redirect to homepage and trigger a full reload to update Navbar state
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        toast.error("Invalid response from server.");
        setError("Invalid response from server.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-width flex justify-start lg:justify-center overflow-x-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-[64px] w-full max-w-[1305px] h-auto xl:pt-10 xl:pb-20">
        {/* Left Side: Hero Image */}
        <div className="hidden lg:flex relative lg:w-[79%] xl:w-[805px] h-[430px] xl:h-[620px] bg-[#cbe4e8] rounded-r-[4px] overflow-hidden">
          <Image
            src="/images/signup-side-image.svg"
            alt="Login Shopping Graphic"
            width={805}
            height={781}
            className="h-full w-full object-cover object-bottom"
            priority
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full px-4 lg:px-0 lg:w-[41%] xl:w-[371px] xl:h-[326px] flex flex-col gap-[48px] mx-auto xl:mx-0">
          {/* Headings */}
          <div>
            <h1 className="text-4xl font-medium tracking-wide mb-6">
              Log in to Exclusive
            </h1>
            <p className="text-gray-900">Enter your details below</p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleLogin} className="flex flex-col gap-10 w-full">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email or Phone Number"
              required
              className="w-full border-b border-gray-400 pb-2 focus:outline-none focus:border-gray-800 bg-transparent text-gray-800 placeholder-gray-500"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full border-b border-gray-400 pb-2 focus:outline-none focus:border-gray-800 bg-transparent text-gray-800 placeholder-gray-500"
            />
            
            {error && <p className="text-red-500 text-sm mt-[-20px]">{error}</p>}

            {/* Buttons & Footer Container */}
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between gap-4 w-full">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="h-14 px-12 bg-[#db4444] text-white font-medium rounded-[4px] hover:bg-red-600 transition-colors disabled:bg-red-400"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                <Link href="/forgot-password" className="text-[#db4444] hover:text-red-600 transition-colors">
                  Forget Password?
                </Link>
              </div>
              
              <button 
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full h-14 border border-gray-400 text-gray-900 font-medium rounded-[4px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mt-2"
              >
                <Image
                  src="/images/google-icon.svg"
                  alt="Google Logo"
                  width={24}
                  height={24}
                />
                Log in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
