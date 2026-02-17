"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">NextShop</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Premium products, fast delivery, and trusted service.
                        We bring the best tech and lifestyle goods directly to your door.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link href="/products" className="hover:text-white transition">Products</Link></li>
                        <li><Link href="/category" className="hover:text-white transition">Categories</Link></li>
                        <li><Link href="/cart" className="hover:text-white transition">Cart</Link></li>
                        <li><Link href="/profile" className="hover:text-white transition">Account</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
                    <ul className="space-y-2">
                        <li><Link href="/" className="hover:text-white transition">Help Center</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Shipping</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Returns</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Contact</Link></li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                    <ul className="space-y-6 gap-4">
                        {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                            <li key={social}>
                                <Link
                                    key={social}
                                    href={`/`}
                                    className="hover:bg-white/20 p-3 rounded-lg transition"
                                >
                                    <span className="capitalize">{social}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 py-6 text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} NextShop. All rights reserved.
            </div>
        </footer>
    );
}
