import { create } from "zustand";

const API = "https://staging-nextshop-backend.prospectbdltd.com/api";

export interface Product {
  productId: number;
  productName: string;
  slug: string;
  thumbnail: string | null;
  shortDescription: string;
  featured: boolean;
  rating: string;
  likesCount: number;
  commentsCount: number;

  // Brand
  brand?: {
    brandId: number;
    brandName: string;
    shortName: string;
  };

  // Category
  category?: Category;

  // Unit details
  unit?: {
    unitId: number;
    unitName: string;
    unitValue: string;
  };

  // User Interaction State
  userReacted: boolean;
  userReaction?: UserReaction;
  userComments: any[]; // Adjust type if comment structure is known
  comments: any[];
  reactions: UserReaction[];

  // Settings
  settings: {
    isGuestLikeEnable: boolean;
    isGuestCommentEnable: boolean;
  };

  // Specifications (Dynamic key-value pairs)
  specifications: Record<string, Record<string, string[]>>;

  // Variants
  variants: ProductVariant[];

  // SEO
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  };
}

// --- Supporting Interfaces ---

export interface Category {
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  parentId: number | null;
  status: boolean;
}

export interface UserReaction {
  reactionId: number;
  guestIdentifier: string | null;
  typeId?: number;
  user: {
    id: number;
    username: string;
    email: string;
  } | null;
  type?: {
    typeId: number;
    type: string;
  };
  reaction_type?: {
    typeId: number;
    type: string;
  };
}

export interface ProductVariant {
  productVariantId: number;
  productId: number;
  price: {
    original: number;
    final: number;
  };
  discount: {
    enabled: boolean;
    type: string | null;
    amount: string;
  };
  vat: {
    enable: boolean;
    type: string | null;
    amount: number;
  };
  stock: {
    quantity: number;
    inStock: boolean;
    availability: string;
  };
  extraInfo: {
    warranty: string | null;
    expiredDate: string | null;
    safetyWarnings: string | null;
  };
  attributes: Record<string, string>;
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
       console.log("errpr fetching products")
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
