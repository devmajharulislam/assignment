import { create } from "zustand";

export interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  checkSession: () => Promise<void>;
  logout: () => void;
}

const API = "https://staging-nextshop-backend.prospectbdltd.com/api";

// Helper functions for localStorage
const getStoredToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const user = localStorage.getItem("auth_user");
    if (!user) return null; // no user saved
    return JSON.parse(user); // safely parse
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null; // fallback if invalid JSON
  }
};


export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await fetch(`${API}/v2/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant": "nextshop",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        set({ loading: false });
        return false;
      }

      const data = await res.json();

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.data.token);
        localStorage.setItem("auth_user", JSON.stringify(data.data.username));
      }

      set({
        user: data.data.username,
        token: data.data.token,
        loading: false,
      });
      return true;
    } catch (err) {
      set({ loading: false });
      return false;
    }
  },

  checkSession: async () => {
    const token = get().token;
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    try {
      const res = await fetch(`${API}/v2/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant": "nextshop",
        },
      });

      if (!res.ok) {
        // Clear localStorage on failed session check
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
        set({ user: null, token: null });
        return;
      }

      const data = await res.json();

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(data.data));
      }

      set({ user: data.data });
    } catch {
      // Clear localStorage on error
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
      set({ user: null, token: null });
    }
  },

  logout: () => {
    // Clear localStorage on logout
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    set({ user: null, token: null });
  },
}));

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  register: (data: RegisterData) => Promise<boolean>;
  resetState: () => void;
}

export const useRegisterStore = create<RegisterState>((set) => ({
  loading: false,
  error: null,
  success: false,

  register: async (data: RegisterData) => {
    set({ loading: true, error: null, success: false });
    try {
      const res = await fetch(`${API}/v2/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant": "nextshop",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        set({
          loading: false,
          error: errorData.message || "Registration failed",
          success: false,
        });
        return false;
      }

      const responseData = await res.json();
      set({ loading: false, error: null, success: true });
      return true;
    } catch (err) {
      set({
        loading: false,
        error: "Network error. Please try again.",
        success: false,
      });
      return false;
    }
  },

  resetState: () => {
    set({ loading: false, error: null, success: false });
  },
}));
