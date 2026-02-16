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
  isAuthenticated: boolean; // ✅ NEW: Track if user is authenticated
  isInitialized: boolean; // ✅ NEW: Track if auth check is complete
  login: (email: string, password: string) => Promise<boolean>;
  checkSession: () => Promise<void>;
  logout: () => void;
  initAuth: () => Promise<void>; // ✅ NEW: Initialize auth on app start
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
    if (!user) return null;
    return JSON.parse(user);
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null, // ✅ Changed: Start as null, will be set by initAuth
  token: null, // ✅ Changed: Start as null, will be set by initAuth
  loading: false,
  isAuthenticated: false, // ✅ NEW
  isInitialized: false, // ✅ NEW

  // ✅ NEW: Initialize auth on app start
  initAuth: async () => {
    console.log("🔄 Initializing auth...");

    const token = getStoredToken();
    const user = getStoredUser();

    if (!token) {
      console.log("❌ No token found");
      set({ isInitialized: true, isAuthenticated: false });
      return;
    }

    // Set token and user from localStorage
    set({ token, user });

    // Verify token with backend
    await get().checkSession();

    set({ isInitialized: true });
  },

  login: async (email, password) => {
    console.log("🔐 Logging in...");
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
        console.log("❌ Login failed");
        set({ loading: false });
        return false;
      }

      const data = await res.json();
      const token = data.data.token;

      console.log("✅ Token received, fetching user data...");

      // ✅ FIXED: Fetch user data from /me API immediately after login
      const userRes = await fetch(`${API}/v2/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant": "nextshop",
        },
      });

      if (!userRes.ok) {
        console.error("❌ Failed to fetch user data");
        set({ loading: false });
        return false;
      }

      const userData = await userRes.json();
      const user = userData.data;

      console.log("✅ User data fetched:", user);

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
      }

      set({
        user,
        token,
        loading: false,
        isAuthenticated: true, // ✅ NEW: Set authenticated flag
        isInitialized: true, // ✅ NEW: Mark as initialized
      });

      console.log("✅ Login complete");
      return true;
    } catch (err) {
      console.error("❌ Login error:", err);
      set({ loading: false });
      return false;
    }
  },

  checkSession: async () => {
    const token = get().token;

    if (!token) {
      console.log("❌ No token to check");
      set({ user: null, token: null, isAuthenticated: false }); // ✅ Updated
      return;
    }

    console.log("🔍 Checking session...");

    try {
      const res = await fetch(`${API}/v2/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant": "nextshop",
        },
      });

      if (!res.ok) {
        console.log("❌ Session invalid");

        // Clear localStorage on failed session check
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }

        set({ user: null, token: null, isAuthenticated: false }); // ✅ Updated
        return;
      }

      const data = await res.json();

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(data.data));
      }

      set({
        user: data.data,
        isAuthenticated: true, // ✅ NEW: Set authenticated flag
      });

      console.log("✅ Session valid");
    } catch (err) {
      console.error("❌ Session check error:", err);

      // Clear localStorage on error
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }

      set({ user: null, token: null, isAuthenticated: false }); // ✅ Updated
    }
  },

  logout: () => {
    console.log("🚪 Logging out...");

    // Clear localStorage on logout
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false, // ✅ NEW: Clear authenticated flag
    });
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
