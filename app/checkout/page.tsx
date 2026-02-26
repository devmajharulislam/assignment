"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface LocationInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  method: "card" | "cash" | "mobile";
  shippingType: "standard" | "express" | "overnight";
}

interface CartItem {
  productId: number;
  productName: string;
  finalPrice: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const {cart ,getCart} = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    getCart();
  }, [getCart]);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "card",
    shippingType: "standard",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load cart from localStorage
    const stored = localStorage.getItem("cart");
    if (stored) {
      const cart: CartItem[] = JSON.parse(stored);
      setCartItems(cart);
      const total = cart.reduce(
        (sum, item) => sum + item.finalPrice * item.quantity,
        0,
      );
      setCartTotal(total);
    }

    // Load saved user info if exists
    const savedUserInfo = localStorage.getItem("checkout_user_info");
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }

    const savedLocationInfo = localStorage.getItem("checkout_location_info");
    if (savedLocationInfo) {
      setLocationInfo(JSON.parse(savedLocationInfo));
    }
  }, []);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!userInfo.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!userInfo.lastName.trim()) newErrors.lastName = "Last name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userInfo.email)) {
      newErrors.email = "Invalid email format";
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!userInfo.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(userInfo.phone.replace(/[-()\s]/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!locationInfo.address.trim()) newErrors.address = "Address is required";
    if (!locationInfo.city.trim()) newErrors.city = "City is required";
    if (!locationInfo.state.trim()) newErrors.state = "State is required";
    if (!locationInfo.zipCode.trim())
      newErrors.zipCode = "ZIP code is required";
    if (!locationInfo.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        localStorage.setItem("checkout_user_info", JSON.stringify(userInfo));
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        localStorage.setItem(
          "checkout_location_info",
          JSON.stringify(locationInfo),
        );
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handlePlaceOrder = () => {
    // Create complete order object
    const order = {
        // eslint-disable-next-line react-hooks/purity
      orderNumber: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
      status: "pending",
      userInfo,
      locationInfo,
      paymentInfo,
      items: cartItems,
      subtotal: cartTotal,
      shippingCost,
      total: totalWithShipping,
    };

    // Get existing orders from localStorage
    const existingOrders = localStorage.getItem("orders");
    const orders = existingOrders ? JSON.parse(existingOrders) : [];

    // Add new order to beginning of array
    orders.unshift(order);

    // Save to localStorage
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("last_order", JSON.stringify(order));

    // Clear cart
    localStorage.removeItem("cart");

    // Redirect to orders page
    alert("Order placed successfully!");
    router.push("/orders");
  };

  const getShippingCost = () => {
    switch (paymentInfo.shippingType) {
      case "standard":
        return 5.99;
      case "express":
        return 12.99;
      case "overnight":
        return 24.99;
      default:
        return 5.99;
    }
  };

  const shippingCost = getShippingCost();
  const totalWithShipping = cartTotal + shippingCost;
  

            if (!cart|| cart==null ) router.push("/products")

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
                    {step === 1 && "User Info"}
                    {step === 2 && "Location"}
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
          {/* Step 1: User Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Personal Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={userInfo.firstName}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, firstName: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={userInfo.lastName}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, lastName: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="john.doe@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, phone: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1234567890"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Shipping Address
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={locationInfo.address}
                  onChange={(e) =>
                    setLocationInfo({
                      ...locationInfo,
                      address: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={locationInfo.city}
                    onChange={(e) =>
                      setLocationInfo({ ...locationInfo, city: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="New York"
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
                    value={locationInfo.state}
                    onChange={(e) =>
                      setLocationInfo({
                        ...locationInfo,
                        state: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={locationInfo.zipCode}
                    onChange={(e) =>
                      setLocationInfo({
                        ...locationInfo,
                        zipCode: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                      errors.zipCode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="10001"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={locationInfo.country}
                    onChange={(e) =>
                      setLocationInfo({
                        ...locationInfo,
                        country: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="United States"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Payment & Shipping
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Payment Method
                </label>
                <div className="space-y-3">
                  {[
                    // { value: "card", label: "Credit/Debit Card", icon: "💳" },
                    { value: "cash", label: "Cash on Delivery", icon: "💵" },
                    // { value: "mobile", label: "Mobile Payment", icon: "📱" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentInfo.method === method.value
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-300 hover:border-indigo-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={paymentInfo.method === method.value}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            method: e.target.value as never,
                          })
                        }
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
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Shipping Type
                </label>
                <div className="space-y-3">
                  {[
                    {
                      value: "standard",
                      label: "Standard Shipping",
                      time: "5-7 business days",
                      cost: "$5.99",
                    },
                    {
                      value: "express",
                      label: "Express Shipping",
                      time: "2-3 business days",
                      cost: "$12.99",
                    },
                    {
                      value: "overnight",
                      label: "Overnight Shipping",
                      time: "Next business day",
                      cost: "$24.99",
                    },
                  ].map((shipping) => (
                    <label
                      key={shipping.value}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentInfo.shippingType === shipping.value
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-300 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value={shipping.value}
                          checked={paymentInfo.shippingType === shipping.value}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              shippingType: e.target.value as never,
                            })
                          }
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {shipping.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {shipping.time}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-indigo-600">
                        {shipping.cost}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Summary */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-900">
                  <span className="text-2xl mr-2">👤</span>
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Name</p>
                    <p className="font-semibold text-gray-900">
                      {userInfo.firstName} {userInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Email</p>
                    <p className="font-semibold text-gray-900">
                      {userInfo.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {userInfo.phone}
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
                  {locationInfo.address}
                  <br />
                  {locationInfo.city}, {locationInfo.state}{" "}
                  {locationInfo.zipCode}
                  <br />
                  {locationInfo.country}
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
                    <p className="text-gray-600 font-medium">Payment Method</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {paymentInfo.method === "card"
                        ? "Credit/Debit Card"
                        : paymentInfo.method === "cash"
                          ? "Cash on Delivery"
                          : "Mobile Payment"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Shipping Type</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {paymentInfo.shippingType.replace("-", " ")} Shipping
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Total */}
              <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Order Total
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">
                      Subtotal ({cartItems.length} items)
                    </span>
                    <span className="font-semibold text-gray-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">Shipping</span>
                    <span className="font-semibold text-gray-900">
                      ${shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t-2 border-indigo-200 pt-3 flex justify-between">
                    <span className="font-bold text-xl text-gray-900">
                      Total
                    </span>
                    <span className="font-bold text-2xl text-indigo-600">
                      ${totalWithShipping.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                <span className="text-blue-600 text-xl mr-3">ℹ️</span>
                <p className="text-sm text-blue-800">
                  By placing this order, you agree to our terms and conditions.
                  You will receive an order confirmation email shortly.
                </p>
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
                className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg"
              >
                Place Order 🎉
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
