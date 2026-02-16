import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextShop - Your Online Store",
  description: "Discover amazing products at NextShop",
};

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
