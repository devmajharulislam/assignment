"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized, initAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Initialize auth on mount
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    // Only redirect after initialization is complete
    if (isInitialized) {
      if (!isAuthenticated && !isPublicRoute) {
        console.log("🚫 Not authenticated, redirecting to login");
        router.replace("/login");
      } else if (isAuthenticated && isPublicRoute) {
        console.log("✅ Already authenticated, redirecting to home");
        router.replace("/");
      }
    }
  }, [isInitialized, isAuthenticated, isPublicRoute, router]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            {/* Animated circles */}
            <div className="w-24 h-24 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="w-24 h-24 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <h2 className="mt-8 text-2xl font-bold text-gray-800">NextShop</h2>
          <p className="mt-2 text-gray-600">Loading your experience...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting (prevents flash of protected content)
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show children only if authenticated or on public route
  return (
    <>
     
      {children}
    </>
  );
}
