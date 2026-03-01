import { create } from "zustand";

const API = "https://staging-nextshop-backend.prospectbdltd.com/api";



export interface ReactionType {
  reactionTypeId: number;
  name: string;
  icon?: string;
}

export interface Reaction {
  reactionId: number;
  productId: number;
  typeId: number;
  createdAt?: string;
}

/* ================================
   Store Interface
================================ */

interface ReactionsState {
  reactionTypes: ReactionType[];
  reactions: Reaction[];

  loading: boolean;
  error: string | null;

  getReactionTypes: () => Promise<void>;
  addReaction: (
    productId: number,
    typeId: number
  ) => Promise<{ success: boolean; reaction?: Reaction; error?: string }>;
  deleteReaction: (
    reactionId: number
  ) => Promise<{ success: boolean; error?: string }>;

  clearReactions: () => void;
}

/* ================================
   Store
================================ */

export const useReactionsStore = create<ReactionsState>((set, get) => ({
  reactionTypes: [],
  reactions: [],

  loading: false,
  error: null,

  /* ================================
     GET reaction types
  ================================= */
  getReactionTypes: async () => {
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

      const res = await fetch(
        `${API}/client/v1/product/reactions/types`,
        {
          method: "GET",
          headers,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch reaction types");
      }

      const data = await res.json();
      console.log("Reaction types response:", data);

      set({
        reactionTypes: data.data || [],
        loading: false,
      });
    } catch (error: any) {
      console.error("Get reaction types error:", error);
      set({
        error: error.message || "Failed to load reaction types",
        loading: false,
      });
    }
  },

  /* ================================
     POST reaction
  ================================= */
  addReaction: async (productId, typeId) => {
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

      const res = await fetch(
        `${API}/client/v1/product/reactions`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            productId,
            typeId,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add reaction");
      }

      const data = await res.json();
      console.log("Add reaction response:", data);

      const newReaction = data.data;

      set((state) => ({
        reactions: [...state.reactions, newReaction],
        loading: false,
      }));

      return { success: true, reaction: newReaction };
    } catch (error: any) {
      console.error("Add reaction error:", error);
      set({
        error: error.message || "Failed to add reaction",
        loading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /* ================================
     DELETE reaction
  ================================= */
  deleteReaction: async (reactionId) => {
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

      const res = await fetch(
        `${API}/client/v1/product/reactions/${reactionId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete reaction");
      }

      set((state) => ({
        reactions: state.reactions.filter(
          (reaction) => reaction.reactionId !== reactionId
        ),
        loading: false,
      }));

      return { success: true };
    } catch (error: any) {
      console.error("Delete reaction error:", error);
      set({
        error: error.message || "Failed to delete reaction",
        loading: false,
      });
      return { success: false, error: error.message };
    }
  },

  /* ================================
     Clear
  ================================= */
  clearReactions: () => {
    set({
      reactionTypes: [],
      reactions: [],
      error: null,
    });
  },
}));