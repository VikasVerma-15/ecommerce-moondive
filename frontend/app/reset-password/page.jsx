"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push("/login");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/reset-password", { token, newPassword: password });
      toast.success("Password reset successfully! Please log in.");
      router.push("/login");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reset password. Token may have expired.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100 mt-20">
      <h1 className="text-3xl font-medium tracking-wide mb-2 text-center text-gray-900">
        Reset Password
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full h-[50px] border-b border-gray-300 bg-transparent focus:outline-none focus:border-[#DB4444] transition-colors"
            disabled={loading}
            required
            minLength={6}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
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
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="section-width flex justify-center py-20 px-4 xl:px-0">
      <Suspense fallback={<div className="mt-20">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
