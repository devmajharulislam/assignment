// app/user/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function UserPage() {
  const router = useRouter();
  const { user, logout, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <div className="text-white text-lg">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-300">
                Manage your account and preferences
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg hover:bg-red-500/30 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Profile Information
          </h2>

          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4 pb-6 border-b border-white/10">
              <div className="w-20 h-20 rounded-full bg-linear-to-r from-[#e94560] to-[#d63447] flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {user.name}
                </h3>
                <p className="text-gray-400">User Profile</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  {user.name}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  {user.email}
                </div>
              </div>

              {/* User ID */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  User ID
                </label>
                <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  #{user.id}
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Account Status
                </label>
                <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-200 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Active
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="pt-6 border-t border-white/10 flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-[#e94560] to-[#d63447] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#e94560]/50 transition-all duration-300">
                Edit Profile
              </button>
              <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
                Change Password
              </button>
              <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
                Settings
              </button> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
