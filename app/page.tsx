"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-indigo-800/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
              NextShop
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover amazing products crafted with passion. High quality meets
            modern innovation in every piece. Fast delivery, secure payments,
            and 24/7 customer support guaranteed.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg shadow-lg transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
              <div className="mb-4 flex justify-center">
                <svg
                  className="w-12 h-12 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M3 12h18M3 17h18"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-500">
                Get your products delivered quickly and safely, right to your
                doorstep.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
              <div className="mb-4 flex justify-center">
                <svg
                  className="w-12 h-12 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-4 0-6 2-6 6 0 2 2 6 6 6s6-4 6-6c0-4-2-6-6-6z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-500">
                Every product is carefully selected to meet the highest quality
                standards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
              <div className="mb-4 flex justify-center">
                <svg
                  className="w-12 h-12 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3-3 6-6 6m6-6c0-3 3-6 6-6m-6 6v6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-500">
                Your transactions are safe with end-to-end encryption and
                trusted payment gateways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About / Info Section */}
      <section className="py-20 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Why Choose NextShop?
            </h2>
            <p className="text-gray-600 mb-6">
              NextShop combines convenience, quality, and affordability. Browse
              our wide range of products, enjoy fast delivery, and experience
              our excellent customer service. Your satisfaction is our top
              priority!
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow hover:bg-indigo-700 transition"
            >
              Browse Products
            </Link>
          </div>

          <div className="md:w-1/2 relative h-80 md:h-96">
            <Image
              src="/hero-products.png"
              alt="NextShop Products"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Call to Action / Newsletter */}
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated!</h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter to receive the latest deals and updates.
        </p>
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg border border-gray-300 flex-1"
          />
          <button className="px-6 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}
