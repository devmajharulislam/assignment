"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, CartItem } from "@/store/useCartStore";

function resolveImage(thumbnail?: string | null) {
  if (!thumbnail) return "/placeholder.jpg";
  if (thumbnail.startsWith("http")) return thumbnail;
  return `${process.env.NEXT_PUBLIC_CDN_BASEURL}/${thumbnail}`;
}

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, getCart, updateCartItem, removeFromCart } =
    useCartStore();

  // Local state for optimistic updates
  const [localCart, setLocalCart] = useState<typeof cart>(null);

  useEffect(() => {
    getCart();
  }, [getCart]);

  // Sync local cart with store cart
  useEffect(() => {
    if (cart) {
      setLocalCart(cart);
    }
  }, [cart]);

  // Save local cart to localStorage whenever it changes
  useEffect(() => {
    if (localCart) {
      localStorage.setItem("local_cart_changes", JSON.stringify(localCart));
    }
  }, [localCart]);

  const handleQuantityChange = (
    productId: number,
    variantId: number,
    newQuantity: number,
  ) => {
    if (newQuantity < 1 || !localCart) return;

    // Optimistic update - instant UI change
    const updatedItems = localCart.cartItems.map((item) => {
      if (item.productId === productId && item.variantId === variantId) {
        const unitPrice = Number(item.unitPrice);
        const newTotal = (unitPrice * newQuantity).toFixed(2);
        return {
          ...item,
          quantity: newQuantity.toString(),
          total: newTotal,
        };
      }
      return item;
    });

    // Recalculate totals
    const subtotal = updatedItems
      .reduce((sum, item) => sum + Number(item.total), 0)
      .toFixed(2);

    setLocalCart({
      ...localCart,
      cartItems: updatedItems,
      subtotal,
      total: subtotal, // Simplified - you can add VAT/discount logic if needed
    });
  };

  const handleRemove = (productId: number, variantId: number) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    if (!localCart) return;

    // Optimistic remove - instant UI change
    const updatedItems = localCart.cartItems.filter(
      (item) => !(item.productId === productId && item.variantId === variantId),
    );

    // Recalculate totals
    const subtotal = updatedItems
      .reduce((sum, item) => sum + Number(item.total), 0)
      .toFixed(2);

    setLocalCart({
      ...localCart,
      cartItems: updatedItems,
      subtotal,
      total: subtotal,
    });
  };

  const syncChangesWithAPI = async () => {
    if (!localCart || !cart) return;

    // Find items that changed quantity
    const changedItems = localCart.cartItems.filter((localItem) => {
      const originalItem = cart.cartItems.find(
        (item) =>
          item.productId === localItem.productId &&
          item.variantId === localItem.variantId,
      );
      return originalItem && originalItem.quantity !== localItem.quantity;
    });

    // Find items that were removed
    const removedItems = cart.cartItems.filter((originalItem) => {
      return !localCart.cartItems.find(
        (item) =>
          item.productId === originalItem.productId &&
          item.variantId === originalItem.variantId,
      );
    });

    // Update quantities
    for (const item of changedItems) {
      await updateCartItem(
        item.productId,
        item.variantId,
        Number(item.quantity),
      );
    }

    // Remove items
    for (const item of removedItems) {
      await removeFromCart(item.productId, item.variantId);
    }

    // Clear local changes
    localStorage.removeItem("local_cart_changes");
  };

  const handleCheckout = async () => {
    // Sync all changes before checkout
    await syncChangesWithAPI();
    router.push("/checkout");
  };

  if (loading && !localCart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!localCart || localCart.cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Start shopping and add items to your cart!
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {localCart.cartItems.length}{" "}
            {localCart.cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {localCart.cartItems.map((item) => {
              const currentQuantity = Number(item.quantity);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={resolveImage(item.thumbnail)}
                        alt={item.productName}
                        fill
                        unoptimized
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 pr-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                            {item.productName}
                          </h3>
                          {item.variantName && (
                            <p className="text-sm text-gray-600 mb-2">
                              Variant: {item.variantName}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            In Stock: {item.stockQuantity}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleRemove(item.productId, item.variantId)
                          }
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            ${Number(item.total).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${Number(item.unitPrice).toFixed(2)} each
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.variantId,
                                currentQuantity - 1,
                              )
                            }
                            disabled={currentQuantity <= 1}
                            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                          >
                            −
                          </button>
                          <span className="text-lg font-semibold text-gray-900 min-w-[3ch] text-center">
                            {currentQuantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.variantId,
                                currentQuantity + 1,
                              )
                            }
                            disabled={currentQuantity >= item.stockQuantity}
                            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Discount/VAT Info */}
                      {(Number(item.discount) > 0 ||
                        Number(item.vatAmount) > 0) && (
                        <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                          {Number(item.discount) > 0 && (
                            <p className="text-green-600">
                              Discount: ${Number(item.discount).toFixed(2)}
                            </p>
                          )}
                          {Number(item.vatAmount) > 0 && (
                            <p className="text-gray-600">
                              VAT: ${Number(item.vatAmount).toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ${Number(localCart.subtotal).toFixed(2)}
                  </span>
                </div>

                {Number(localCart.totalDiscount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">
                      -${Number(localCart.totalDiscount).toFixed(2)}
                    </span>
                  </div>
                )}

                {Number(localCart.totalVat) > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>VAT</span>
                    <span className="font-semibold">
                      ${Number(localCart.totalVat).toFixed(2)}
                    </span>
                  </div>
                )}

                {Number(localCart.totalShipping) > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      ${Number(localCart.totalShipping).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-600">
                      ${Number(localCart.total).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {localCart.currency}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/products"
                className="block w-full py-3 text-center border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-indigo-600 hover:text-indigo-600 transition-colors"
              >
                Continue Shopping
              </Link>

              {/* User Info */}
              {localCart.user && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Shopping as:</p>
                  <p className="font-semibold text-gray-900">
                    {localCart.user.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {localCart.user.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
