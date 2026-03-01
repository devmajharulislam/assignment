// app/user/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function UserPage() {
  const router = useRouter();
  const { user, logout, checkSession,isAdmin } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, []);
  
console.log(isAdmin)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-800 text-lg">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Profile Information
          </h2>

          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user.name}
                </h3>
                <p className="text-gray-500">User Profile</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <div className="px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-900">
                  {user.name}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Email Address
                </label>
                <div className="px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-900">
                  {user.email}
                </div>
              </div>

              {/* User ID */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  User ID
                </label>
                <div className="px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-900">
                  #{user.id}
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Account Status
                </label>
                <div className="px-4 py-3 rounded-lg bg-green-100 border border-green-200 text-green-800 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Active
                </div>
              </div>
            </div>

           
            </div>
          </div>
        </div>
      </div>
 
  );
}
