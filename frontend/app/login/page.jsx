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
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 xl:gap-10 w-full max-w-[1305px] h-auto xl:pt-10 xl:pb-20">
        {/* Left Side: Hero Image */}
        <div className="hidden lg:flex relative h-[430px] xl:h-[620px] aspect-[805/781] rounded-2xl overflow-hidden">
          <Image
            src="/images/signup-side-image.svg"
            alt="Login Shopping Graphic"
            width={805}
            height={781}
            className="h-full w-full object-cover animate-fade-in-up"
            priority
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full px-4 lg:px-0 lg:w-[40%] xl:w-[371px] xl:h-[auto] flex flex-col gap-6 mx-auto xl:mx-0 py-8">
          {/* Headings */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">
              Log in to Exclusive
            </h1>
            <p className="text-gray-600 text-base">Enter your details below to continue</p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email or Phone Number"
                required
                className="w-full border-b-2 border-gray-200 pb-3 focus:outline-none focus:border-[#DB4444] bg-transparent text-gray-900 placeholder-gray-400 transition-colors"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full border-b-2 border-gray-200 pb-3 focus:outline-none focus:border-[#DB4444] bg-transparent text-gray-900 placeholder-gray-400 transition-colors"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm mt-[-10px] animate-fade-in-up">{error}</p>}

            {/* Buttons & Footer Container */}
            <div className="flex flex-col gap-3 w-full mt-2">
              <div className="flex items-center justify-between gap-4 w-full">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="h-14 px-10 bg-[#db4444] text-white font-medium rounded-lg hover:bg-red-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:bg-red-400 disabled:transform-none disabled:shadow-none"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                <Link href="/forgot-password" className="text-[#db4444] font-medium hover:text-red-600 hover:underline underline-offset-4 decoration-2 transition-all">
                  Forget Password?
                </Link>
              </div>
              
              <button 
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full h-14 border-2 border-gray-200 text-gray-800 font-medium rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group mt-2"
              >
                <Image
                  src="/images/google-icon.svg"
                  alt="Google Logo"
                  width={24}
                  height={24}
                  className="group-hover:scale-110 transition-transform duration-300"
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
