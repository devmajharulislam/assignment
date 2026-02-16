import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import NavBar from "@/components/ui/NavBar";
import AuthProvider from "@/components/ui/AuthInitializer";
import AuthInitializer from "@/components/ui/AuthInitializer";

import Footer from "@/components/ui/Footer";

import Footer from "@/components/Footer";

// import AppLayout from "@/components/ui/AppLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* AuthGuard wraps the entire app */}
        <NavBar/>
        <AuthGuard>{children}</AuthGuard>
      <Footer/>
      </body>

    </html>
  );
}
