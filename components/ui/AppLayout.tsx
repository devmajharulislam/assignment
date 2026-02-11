"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/ui/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth on app mount
    initAuth();
  }, [initAuth]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main>{children}</main>
    </div>
  );
}
