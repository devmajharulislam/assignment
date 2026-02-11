"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const publicRoutes = ["/login", "/register"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAuthStore((s) => s.token);
  const initAuth = useAuthStore((s) => s.initAuth);

  const router = useRouter();
  const path = usePathname();

  // Load token from localStorage on mount
  useEffect(() => {
    initAuth();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!token && !publicRoutes.includes(path)) {
      router.push("/login");
    }
  }, [token, path]);

  return <>{children}</>;
}
