import { create } from "zustand";

const API = "https://staging-nextshop-backend.prospectbdltd.com/api";

export interface CartItem {
    id: number;
    productId: number;
    variantId: number;
    productName: string;
    variantName: string | null;
    quantity: string;
    unitPrice: string;
    discount: string;
    vatAmount: string;
    shippingAmount: string;
    subtotal: string;
    total: string;
    thumbnail: string;
    stockQuantity: number;
}

export interface Cart {
    id: number;
    cartId: string;
    sessionId: string;
    user: {
        id: number;
        username: string;
        company: string;
        email: string;
    } | null;
    totalDiscount: string;
    totalVat: string;
    totalShipping: string;
    subtotal: string;
    total: string;
    currency: string;
    cartItems: CartItem[];
    createdAt: string;
    updatedAt: string;
}

interface CartState {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
    sessionId: string | null;

    // Actions
    addToCart: (
        productId: number,
        variantId: number,
        quantity: number,
    ) => Promise<boolean>;
    getCart: () => Promise<void>;
    updateCartItem: (
        productId: number,
        variantId: number,
        quantity: number,
    ) => Promise<boolean>;
    removeFromCart: (productId: number, variantId: number) => Promise<boolean>;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    cart: null,
    loading: false,
    error: null,
    sessionId: null,

    addToCart: async (productId: number, variantId: number, quantity: number) => {
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

            const res = await fetch(`${API}/client/v1/cart`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    items: [
                        {
                            productId,
                            productVariantId: variantId,
                            quantity,
                        },
                    ],
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to add item to cart");
            }

            const data = await res.json();

            // Store the cart data and session ID
            set({
                cart: data.data,
                sessionId: data.data.sessionId,
                loading: false,
            });

            // Save session ID to localStorage for later use in checkout
            localStorage.setItem("cart_session_id", data.data.sessionId);

            return true;
        } catch (error) {
            console.error("Add to cart error:", error);
            set({
                error: "Failed to add item to cart",
                loading: false,
            });
            return false;
        }
    },

    getCart: async () => {
        try {
            set({ loading: true, error: null });

            const sessionId = localStorage.getItem("cart_session_id");
            const token = localStorage.getItem("auth_token");
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
                "X-Tenant": "nextshop",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(`${API}/client/v1/cart/${sessionId}`, {
                method: "GET",
                headers,
            });

            if (!res.ok) {
                throw new Error("Failed to fetch cart");
            }

            const data = await res.json();

            set({
                cart: data.data,
                sessionId: data.data?.sessionId || null,
                loading: false,
            });

            // Save session ID to localStorage
            if (data.data?.sessionId) {
                localStorage.setItem("cart_session_id", data.data.sessionId);
            }
        } catch (error) {
            console.error("Get cart error:", error);
            set({
                error: "Failed to load cart",
                loading: false,
                cart: null,
            });
        }
    },

    updateCartItem: async (
        productId: number,
        variantId: number,
        quantity: number,
    ) => {
        try {
            set({ loading: true, error: null });

            const sessionId = localStorage.getItem("cart_session_id");
            const token = localStorage.getItem("auth_token");

            const headers: Record<string, string> = {
                "Content-Type": "application/json",
                "X-Tenant": "nextshop",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }


            const res = await fetch(`${API}/client/v1/cart/${sessionId}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({
                    items: [
                        {
                            productId,
                            productVariantId: variantId,
                            quantity,
                        },
                    ],
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update cart item");
            }

            const data = await res.json();

            // Update the cart data
            set({
                cart: data.data,
                loading: false,
            });

            return true;
        } catch (error) {
            console.error("Update cart error:", error);
            set({
                error: "Failed to update cart item",
                loading: false,
            });
            return false;
        }
    },

    removeFromCart: async (productId: number, variantId: number) => {
        try {
            set({ loading: true, error: null });

            const token = localStorage.getItem("auth_token");
            const sessionId = localStorage.getItem("cart_session_id");
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
                "X-Tenant": "nextshop",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            // ✅ Fixed: Changed endpoint to /delete-cart/
            const res = await fetch(`${API}/client/v1/delete-cart/${sessionId}`, {
                method: "DELETE",
                headers,
                body: JSON.stringify({
                    items: [
                        {
                            productId,
                            productVariantId: variantId,
                        },
                    ],
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to remove item from cart");
            }

            const data = await res.json();

            // Update the cart data
            set({
                cart: data.data,
                loading: false,
            });

            return true;
        } catch (error) {
            console.error("Remove from cart error:", error);
            set({
                error: "Failed to remove item from cart",
                loading: false,
            });
            return false;
        }
    },

    clearCart: () => {
        set({
            cart: null,
            sessionId: null,
            error: null,
        });
        localStorage.removeItem("cart_session_id");
    },
}));
