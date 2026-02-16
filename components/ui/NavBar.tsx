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
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            NextShop
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["Home", "Products", "Category", "Cart"].map((item) => (
            <Link
              key={item}
              href={`/${item === "Home" ? "" : item.toLowerCase()}`}
              className="text-gray-800 hover:text-indigo-600 transition"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    View profile
                  </p>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b">
                    <p className="text-xs text-gray-600">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-2 text-sm font-medium">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-5 py-2 text-gray-900 hover:bg-gray-200 transition"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-5 py-2 text-gray-900 hover:bg-gray-200 transition"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-5 py-2 text-gray-900 hover:bg-gray-200 transition"
                    >
                      Settings
                    </Link>
                  </div>

                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6">
                <Link href="/login">Login</Link>
              </Button>
              <Button className="rounded-full bg-gray-900 hover:bg-black text-white px-6">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
