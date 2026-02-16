"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function AuthInitializer() {
    const checkSession = useAuthStore((s) => s.checkSession);
    const user = useAuthStore((s) => s.user);
    const router = useRouter();

    useEffect(() => {
        async function init() {
            await checkSession();


            if (!user) {
                router.push("/login"); // replace to avoid back navigation
            }
        }

        init();
    }, [checkSession, user, router]);

    return null;
}
