import { create } from "zustand";

const API = "https://staging-nextshop-backend.prospectbdltd.com/api";

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  createAccount: boolean;
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PlaceOrderRequest {
  sessionId: string;
  branchId: number;
  customer: OrderCustomer;
  billingAddressId?: number;
  billingAddress?: Address;
  shippingAddressId?: number;
  shippingAddress?: Address;
  shippingMethod: string;
  deliveryDate?: string;
  paymentMethod: string;
  notes?: string;
  couponCode?: string;
  meta?: {
    platform: string;
    source: string;
  };
}

export interface Order {
  orderId: number;
  orderNumber: string;
  invoiceNumber: string;
  invoiceDate: string;

  currency: string;
  orderType: string;
  status: string;

  subtotal: string;
  totalDiscount: string;
  totalTax: string;
  shippingTotal: string;
  grandTotal: string;

  shippingMethod: string;
  deliveryDate: string | null;

  customer: OrderCustomer;
  billingAddress: Address;
  shippingAddress: Address;



  createdAt: string;
  updatedAt: string;
}


    export interface OrderCustomer {
      customerId: number;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
    }

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;

  placeOrder: (
    orderData: PlaceOrderRequest,
  ) => Promise<{ success: boolean; order?: Order; error?: string }>;
  getOrders: () => Promise<void>;
  getOrderById: (orderId: number) => Promise<Order | null>;
  clearOrders: () => void;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  placeOrder: async (orderData: PlaceOrderRequest) => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Tenant": "nextshop",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API}/client/v1/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      const data = await res.json();
      console.log("Place order response:", data);

      set({
        currentOrder: data.data,
        loading: false,
      });

      // Clear cart session after successful order
      localStorage.removeItem("cart_session_id");
      localStorage.removeItem("local_cart_changes");

      return { success: true, order: data.data };
    } catch (error: any) {
      console.error("Place order error:", error);
      set({
        error: error.message || "Failed to place order",
        loading: false,
      });
      return { success: false, error: error.message };
    }
  },

  getOrders: async () => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Tenant": "nextshop",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API}/client/v1/orders`, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      console.log("Get orders response:", data);

      set({
        orders: data.data.result || [],
        loading: false,
      });
    } catch (error) {
      console.error("Get orders error:", error);
      set({
        error: "Failed to load orders",
        loading: false,
        orders: [],
      });
    }
  },

  getOrderById: async (orderId: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Tenant": "nextshop",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API}/client/v1/orders/${orderId}`, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch order");
      }

      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error("Get order error:", error);
      return null;
    }
  },

  clearOrders: () => {
    set({
      orders: [],
      currentOrder: null,
      error: null,
    });
  },
}));
