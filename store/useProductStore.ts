import { create } from "zustand";

const API = "https://staging-nextshop-backend.prospectbdltd.com/api";

export interface Product {
  productId: number;
  productName: string;
  slug: string;
  thumbnail: string | null;
  shortDescription: string;
  featured: boolean;
  quantity: number;

  originalPrice: number;
  finalPrice: number;

  discount?: {
    enabled: boolean;
    type: string;
    amount: string;
  };

  stockQuantity: number;
  inStock: boolean;
  availability: string;

  shippingCost: string;

  rating: string;
  likesCount: number;
  commentsCount: number;

  brand?: {
    brandName: string;
    shortName: string;
  };
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<Product | null>;
  fetchProductBySlug: (slug: string) => Promise<Product | null>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${API}/client/v1/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant": "nextshop",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();

      set({
        products: data.data ?? [],
        loading: false,
      });
    } catch (error) {
      console.error("Fetch products error:", error);
      set({
        error: "Failed to load products. Please try again.",
        loading: false,
      });
    }
  },
  fetchProductBySlug: async (slug: string) => {
    try {
      const res = await fetch(`${API}/client/v1/products/slug/${slug}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Tenant": "nextshop",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch product");

      const data = await res.json();
      return data.data || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  fetchProductById: async (id: number) => {
    try {
      const res = await fetch(`${API}/client/v1/products/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant": "nextshop",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await res.json();
      return data.data ?? null;
    } catch (error) {
      console.error("Fetch product error:", error);
      return null;
    }
  },
}));
