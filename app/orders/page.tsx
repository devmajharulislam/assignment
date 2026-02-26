"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useOrdersStore } from "@/store/useOrderStore";

export default function OrdersPage() {
  const { orders, loading, getOrders } = useOrdersStore();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    console.log("ORDERS:", orders);
  }, [orders]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            View and track all your orders in one place
          </p>
        </div>

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
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div
                key={order.orderId}
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
                        Placed on {formatDate(order.invoiceDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        ${Number(order.grandTotal).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        SHIP TO
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.customer?.customerName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.shippingAddress?.state}{" "}
                        {order.shippingAddress?.postalCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        PAYMENT
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.orderType?.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        SHIPPING
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.shippingMethod}
                      </p>
                    </div>
                  </div>

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

        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details
                  </h2>
                  <p className="text-sm text-gray-600 ">
                    {selectedOrder.orderNumber}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(selectedOrder.invoiceDate)}
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

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm text-black">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.customer?.customerName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.customer?.customerEmail}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedOrder.customer?.customerPhone}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">
                    Shipping Address
                  </h3>
                  <p className="text-sm font-medium text-gray-900 leading-relaxed">
                    {selectedOrder.shippingAddress?.addressLine1}
                    {selectedOrder.shippingAddress?.addressLine2 && (
                      <>, {selectedOrder.shippingAddress.addressLine2}</>
                    )}
                    <br />
                    {selectedOrder.shippingAddress?.state}{" "}
                    {selectedOrder.shippingAddress?.postalCode}
                    <br />
                    {selectedOrder.shippingAddress?.country}
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">
                        Subtotal ({selectedOrder.items?.length || 0} items)
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${Number(selectedOrder.subtotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t-2 border-indigo-200 pt-3 flex justify-between">
                      <span className="font-bold text-xl text-gray-900">
                        Total
                      </span>
                      <span className="font-bold text-2xl text-indigo-600">
                        ${Number(selectedOrder.grandTotal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t px-8 py-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}