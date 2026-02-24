"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  orderNumber: string;
  orderDate: string;
  status: string;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  locationInfo: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentInfo: {
    method: "card" | "cash" | "mobile";
    shippingType: "standard" | "express" | "overnight";
  };
  items: Array<{
    productId: number;
    productName: string;
    finalPrice: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "cash":
        return "Cash on Delivery";
      case "mobile":
        return "Mobile Payment";
      default:
        return method;
    }
  };

  const getShippingTypeLabel = (type: string) => {
    switch (type) {
      case "standard":
        return "Standard Shipping";
      case "express":
        return "Express Shipping";
      case "overnight":
        return "Overnight Shipping";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            View and track all your orders in one place
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start shopping and your orders will appear here
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items.length} item
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Order Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        SHIP TO
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.userInfo.firstName} {order.userInfo.lastName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.locationInfo.city}, {order.locationInfo.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        PAYMENT
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {getPaymentMethodLabel(order.paymentInfo.method)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        SHIPPING
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {getShippingTypeLabel(order.paymentInfo.shippingType)}
                      </p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.orderNumber}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Order Status & Date */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(selectedOrder.orderDate)}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                        selectedOrder.status,
                      )}`}
                    >
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">
                    Order Items ({selectedOrder.items.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900">
                          ${(item.finalPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-900">
                    <span className="text-2xl mr-2">👤</span>
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium mb-1">Name</p>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder.userInfo.firstName}{" "}
                        {selectedOrder.userInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">Email</p>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder.userInfo.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder.userInfo.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-900">
                    <span className="text-2xl mr-2">📍</span>
                    Shipping Address
                  </h3>
                  <p className="text-sm font-medium text-gray-900 leading-relaxed">
                    {selectedOrder.locationInfo.address}
                    <br />
                    {selectedOrder.locationInfo.city},{" "}
                    {selectedOrder.locationInfo.state}{" "}
                    {selectedOrder.locationInfo.zipCode}
                    <br />
                    {selectedOrder.locationInfo.country}
                  </p>
                </div>

                {/* Payment & Shipping */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-900">
                    <span className="text-2xl mr-2">💳</span>
                    Payment & Delivery
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium mb-1">
                        Payment Method
                      </p>
                      <p className="font-semibold text-gray-900">
                        {getPaymentMethodLabel(
                          selectedOrder.paymentInfo.method,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">
                        Shipping Type
                      </p>
                      <p className="font-semibold text-gray-900">
                        {getShippingTypeLabel(
                          selectedOrder.paymentInfo.shippingType,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Total */}
                <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">
                        Subtotal ({selectedOrder.items.length} items)
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${selectedOrder.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">
                        Shipping
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${selectedOrder.shippingCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t-2 border-indigo-200 pt-3 flex justify-between">
                      <span className="font-bold text-xl text-gray-900">
                        Total
                      </span>
                      <span className="font-bold text-2xl text-indigo-600">
                        ${selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t px-8 py-4 flex gap-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Track Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
