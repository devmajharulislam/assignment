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
  }, [isInitialized, isAuthenticated, isPublicRoute, router, pathname]);

  // Show beautiful loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          {/* Animated Logo/Spinner */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer ring */}
            <div className="absolute inset-0 border-8 border-indigo-200 rounded-full"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 border-8 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
            {/* Inner spinning ring */}
            <div
              className="absolute inset-2 border-8 border-transparent border-t-purple-600 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Brand Name */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            NextShop
          </h2>
          <p className="text-gray-600 animate-pulse">
            Loading your experience...
          </p>
        </div>
      </div>
    );
  }

  // Show redirecting screen while navigating (prevents flash of protected content)
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If authenticated but on public route, show redirecting
  if (isAuthenticated && isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  // Show children only when:
  // 1. Authenticated and on protected route, OR
  // 2. Not authenticated and on public route
  return <>{children}</>;
}
