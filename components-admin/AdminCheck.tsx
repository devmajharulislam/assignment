"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation"; // IMPORTANT: use next/navigation in App Router

export const AdminCheck = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { checkSession, isAdmin } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkSession(); // wait for session to be checked
      setLoading(false);

      // Redirect if not admin
      if (!useAuthStore.getState().isAdmin) {
        router.replace("/"); // safe inside useEffect
      }
    };
    init();
  }, [router, checkSession]);

  // Don’t render children until session is checked
  if (loading) return null;

  // Only render if admin
  if (!isAdmin) return null;

  return <>{children}</>;
};
