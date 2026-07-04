"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/users/register", formData);
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
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
            alt="Sign Up Shopping Graphic"
            width={805}
            height={781}
            className="h-full w-full object-cover animate-fade-in-up"
            priority
          />
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="w-full px-4 lg:px-0 lg:w-[40%] xl:w-[371px] xl:h-auto flex flex-col gap-6 mx-auto xl:mx-0 py-8">
          {/* Headings */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">
              Create an account
            </h1>
            <p className="text-gray-600 text-base">Enter your details below to get started</p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full border-b-2 border-gray-200 pb-3 focus:outline-none focus:border-[#DB4444] bg-transparent text-gray-900 placeholder-gray-400 transition-colors"
              />
            </div>
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
              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-[#db4444] text-white font-medium rounded-lg hover:bg-red-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:bg-red-400 disabled:transform-none disabled:shadow-none"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <button 
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full h-14 border-2 border-gray-200 text-gray-800 font-medium rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 group"
              >
                <Image
                  src="/images/google-icon.svg"
                  alt="Google Logo"
                  width={24}
                  height={24}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                Sign up with Google
              </button>
              
              {/* Footer */}
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
                <p>Already have an account?</p>
                <Link href="/login" className="text-[#DB4444] font-medium hover:underline underline-offset-4 decoration-2 transition-all">
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
