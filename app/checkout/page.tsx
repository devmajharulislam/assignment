"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useOrdersStore, OrderCustomer, Address } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCart } = useCartStore();
  const { placeOrder, loading: orderLoading } = useOrdersStore();
  const { user } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);

  // Customer Info
const [customer, setCustomer] = useState<{
  customerId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}>({
  customerId: undefined,
  customerName: user?.name || "",
  customerEmail: user?.email || "",
  customerPhone: "",
});
  // Shipping Address
  const [shippingAddress, setShippingAddress] = useState<Address>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "BD",
  });

  // Payment & Shipping
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getCart();
  }, [getCart]);

  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customer.customerName.trim()) newErrors.name = "Name is required";
    if (!customer.customerEmail.trim()) newErrors.email = "Email is required";
    if (!customer.customerPhone.trim()) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!shippingAddress.city.trim()) newErrors.city = "City is required";
    if (!shippingAddress.state.trim()) newErrors.state = "State is required";
    if (!shippingAddress.postalCode.trim())
      newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handlePlaceOrder = async () => {
    if (!cart?.sessionId) {
      alert("Cart session not found. Please add items to cart first.");
      return;
    }

    const orderData = {
      sessionId: cart.sessionId,
      branchId: 1,
      customer,
      shippingAddress,
      billingAddress: shippingAddress, // Using same address for billing
      shippingMethod,
      paymentMethod,
      notes: notes || undefined,
      couponCode: couponCode || undefined,
      meta: {
        platform: "web",
        source: "ecommerce",
      },
    };

    const result = await placeOrder(orderData);

    if (result.success) {
      alert("Order placed successfully!");
      router.push("/orders");
    } else {
      alert(`Failed to place order: ${result.error}`);
    }
  };

  if (!cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {currentStep > step ? "✓" : step}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium ${
                      currentStep >= step ? "text-indigo-600" : "text-gray-500"
                    }`}
                  >
                    {step === 1 && "Customer"}
                    {step === 2 && "Address"}
                    {step === 3 && "Payment"}
                    {step === 4 && "Review"}
                  </p>
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 flex-1 transition-all ${
                      currentStep > step ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Customer Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Customer Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customer.customerName}
                  onChange={(e) =>
                    setCustomer({ ...customer, customerName: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={customer.customerEmail}
                  onChange={(e) =>
                    setCustomer({ ...customer, customerEmail: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={customer.customerPhone}
                  onChange={(e) =>
                    setCustomer({ ...customer, customerPhone: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="01XXXXXXXXX"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Shipping Address */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Shipping Address
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={shippingAddress.addressLine1}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      addressLine1: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.addressLine1 ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="House/Flat No, Street"
                />
                {errors.addressLine1 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.addressLine1}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={shippingAddress.addressLine2}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      addressLine2: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Area, Landmark (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        state: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postalCode: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postalCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment & Shipping Method */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Payment & Shipping
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Shipping Method
                </label>
                <div className="space-y-3">
                  {[
                    {
                      value: "standard",
                      label: "Standard Shipping",
                      time: "5-7 days",
                      cost: "$5.99",
                    },
                    {
                      value: "express",
                      label: "Express Shipping",
                      time: "2-3 days",
                      cost: "$12.99",
                    },
                    {
                      value: "overnight",
                      label: "Overnight",
                      time: "Next day",
                      cost: "$24.99",
                    },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        shippingMethod === method.value
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-300 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          value={method.value}
                          checked={shippingMethod === method.value}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {method.label}
                          </p>
                          <p className="text-sm text-gray-500">{method.time}</p>
                        </div>
                      </div>
                      <span className="font-bold text-indigo-600">
                        {method.cost}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Payment Method
                </label>
                <div className="space-y-3">
                  {[
                    { value: "cod", label: "Cash on Delivery", icon: "💵" },
                    { value: "card", label: "Credit/Debit Card", icon: "💳" },
                    { value: "mobile", label: "Mobile Banking", icon: "📱" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === method.value
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-300 hover:border-indigo-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <span className="font-medium text-gray-900">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900 bg-white"
                  rows={3}
                  placeholder="Any special instructions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code (Optional)
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Enter coupon code"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Summary */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-900">
                    <span className="font-medium">Name:</span> {customer.customerName}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Email:</span> {customer.customerEmail}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Phone:</span> {customer.customerPhone}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Shipping Address
                </h3>
                <p className="text-sm font-medium text-gray-900 leading-relaxed">
                  {shippingAddress.addressLine1}
                  {shippingAddress.addressLine2 && (
                    <>, {shippingAddress.addressLine2}</>
                  )}
                  <br />
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.country}
                </p>
              </div>

              {/* Payment & Shipping */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Payment & Delivery
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-900">
                    <span className="font-medium">Shipping:</span>{" "}
                    {shippingMethod}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Payment:</span>{" "}
                    {paymentMethod}
                  </p>
                  {notes && (
                    <p className="text-gray-900">
                      <span className="font-medium">Notes:</span> {notes}
                    </p>
                  )}
                  {couponCode && (
                    <p className="text-gray-900">
                      <span className="font-medium">Coupon:</span> {couponCode}
                    </p>
                  )}
                </div>
              </div>

              {/* Cart Total */}
              <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Order Total
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ${Number(cart.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t-2 border-indigo-200 pt-3 flex justify-between">
                    <span className="font-bold text-xl text-gray-900">
                      Total
                    </span>
                    <span className="font-bold text-2xl text-indigo-600">
                      ${Number(cart.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="ml-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading}
                className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderLoading ? "Placing Order..." : "Place Order 🎉"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
