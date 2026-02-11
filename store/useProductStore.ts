import { create } from "zustand";

const API = "https://staging-nextshop-backend.prospectbdltd.com/api";

export interface Product {
  productId: number;
  productName: string;
  description: string;
  finalPrice: number;
  sale_price?: number;
  thumbnail: string | null;
  images?: string[];
  stock: number;
  category?: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  rating?: number;
  reviews_count?: number;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalProducts: number;

  fetchProducts: (page?: number) => Promise<void>;
  fetchProductById: (id: number) => Promise<Product | null>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,

  fetchProducts: async (page = 1) => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${API}/client/v1/products?page=${page}`, {
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
        products: data.data.data || data.data || [],
        currentPage: data.data.current_page || page,
        totalPages: data.data.last_page || 1,
        totalProducts: data.data.total || 0,
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
      console.log("Product detail response:", data);

      return data.data || null;
    } catch (error) {
      console.error("Fetch product error:", error);
      return null;
    }
  },
}));
