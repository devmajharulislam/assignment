import { create } from "zustand";

const API = "https://staging-nextshop-backend.prospectbdltd.com/api";

export interface Category {
  categoryId: number;
  categoryName: string;
  imageUrl: string | null;
  parentId: number | null;
  children?: Category[];
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(`${API}/client/v1/categories`, {
        headers: {
          "Content-Type": "application/json",
          "X-Tenant": "nextshop",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();

      set({
        categories: data.data || [],
        loading: false,
      });
    } catch (err) {
      console.error(err);
      set({
        error: "Failed to load categories",
        loading: false,
      });
    }
  },
}));
