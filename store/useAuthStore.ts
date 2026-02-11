import { create } from "zustand";

const API = "https://staging-nextshop-backend.prospectbdltd.com/api";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => void;
  initAuth: () => Promise<void>;
  fetchUser: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  isInitialized: false,

  initAuth: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ token, loading: true });
      await get().fetchUser();
    }
    set({ isInitialized: true });
  },

  fetchUser: async () => {
    try {
      const token = get().token;
      if (!token) return false;

      const res = await fetch(`${API}/v2/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant": "nextshop",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Token is invalid, clear it
        localStorage.removeItem("token");
        set({ user: null, token: null, loading: false });
        return false;
      }

      const data = await res.json();
   
      set({
        user: data.data.user || data.data,
        loading: false,
      });

      return true;
    } catch (error) {
      console.error("Fetch user error:", error);
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
      return false;
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true });

      const res = await fetch(`${API}/v2/auth/login`, {
   
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant": "nextshop",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Login failed:", errorData);
        throw new Error("Login failed");
      }

      const data = await res.json();
    

      localStorage.setItem("token", data.data.token);

      set({
        user: data.data.user,
        token: data.data.token,
        loading: false,
        isInitialized: true,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      set({ loading: false });
      return false;
    }
  },

  register: async (name, email, phone, password) => {
    // ✅ FIXED: parameter order
    try {
      set({ loading: true });

      const res = await fetch(`${API}/v2/auth/register`, {
        // ✅ FIXED: parentheses, not backticks
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant": "nextshop",
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Registration failed:", errorData);
        throw new Error("Registration failed");
      }

      const data = await res.json();
      console.log("Register response:", data);

      localStorage.setItem("token", data.data.token);

      set({
        user: data.data.user,
        token: data.data.token,
        loading: false,
        isInitialized: true,
      });

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      set({ loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
