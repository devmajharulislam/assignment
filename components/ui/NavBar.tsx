"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function NavBar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold text-lg text-gray-900">
            MyStore
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="hover:text-indigo-600 text-gray-800 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="hover:text-indigo-600 text-gray-800 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/category"
            className="hover:text-indigo-600 text-gray-800 transition-colors"
          >
            Category
          </Link>
        </nav>

        {/* Right - Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-900 font-medium text-sm">
                  {user.name}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-300">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate mt-1">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-gray-300">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link href="/login">Login</Link>
              </Button>
              <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
