"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Updated CartItem interface to match API response
interface CartItem {
  productId: number;
  productName: string;
  thumbnail?: string;
  finalPrice: number;
  quantity: number;
  inStock: boolean;
  stockQuantity: number;
}

// Helper to resolve image URL
function resolveImage(thumbnail: string) {
  // If thumbnail is a “via.placeholder.com” image, treat as empty
  if (!thumbnail || thumbnail.includes("via.placeholder.com"))
    return "/placeholder.jpg";

  // If already a full URL (real CDN), use it directly
  if (thumbnail.startsWith("http")) return thumbnail;
  return `https://cdn-staging-nextshop.prospectbdltd.com/api/temporary-url/${thumbnail}`;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Remove item
  const removeItem = (id: number) => {
    const updated = cart.filter((p) => p.productId !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Increment quantity
  const increment = (id: number) => {
    const updated = cart.map((item) =>
      item.productId === id && item.quantity < item.stockQuantity
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Decrement quantity
  const decrement = (id: number) => {
    const updated = cart
      .map((item) =>
        item.productId === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      )
      .filter((item) => item.quantity > 0);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Subtotal = sum of finalPrice * quantity
  const subtotal = cart.reduce(
    (acc, item) => acc + item.finalPrice * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 text-black">
      <div className="max-w-7xl mx-auto px-4 lg:grid lg:grid-cols-4 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

          {cart.length === 0 && (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm">
              <p className="mb-4">Your cart is empty</p>
              <Link
                href="/products"
                className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg"
              >
                Continue Shopping
              </Link>
            </div>
          )}

          {cart.map((product) => (
            <div
              key={product.productId}
              className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-row gap-4 p-4"
            >
              {/* Image */}
              <div className="relative w-32 aspect-square bg-gray-100 flex-shrink-0">
                <Image
                    src={product.thumbnail
                        ? resolveImage(product.thumbnail)
                        : "/placeholder.jpg"}
                  alt={product.productName}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1">
                <h3 className="font-semibold text-black mb-2">
                  {product.productName}
                </h3>

                <p className="text-gray-700 mb-1">
                  {product.inStock ? (
                    <span className="text-green-600 font-medium">
                      In Stock ({product.stockQuantity})
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      Out of Stock
                    </span>
                  )}
                </p>

                <p className="text-indigo-600 font-bold mb-4">
                  ${product.finalPrice.toFixed(2)}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => decrement(product.productId)}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-semibold">{product.quantity}</span>
                  <button
                    onClick={() => increment(product.productId)}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(product.productId)}
                  className="mt-auto bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition w-32"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-6 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <button
            disabled={cart.length === 0}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
