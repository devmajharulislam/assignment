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
  isAuthenticated: boolean;
  isInitialized: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  checkSession: () => Promise<void>;
  logout: () => void;
  initAuth: () => Promise<void>;
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
  user: null,
  token: null,
  loading: false,
  isAuthenticated: false,
  isInitialized: false,
  isAdmin: false,

  initAuth: async () => {
    // console.log("🔄 Initializing auth...");

    const token = getStoredToken();
    const user = getStoredUser();

    if (!token) {
      // console.log("❌ No token found");
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
    // console.log("🔐 Logging in...");
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
        // console.log("❌ Login failed");
        set({ loading: false });
        return false;
      }

      const data = await res.json();
      const token = data.data.token;

      // console.log("✅ Login successful, token received");

      // Save token to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
      }

      // Set token in state
      set({ token });

      // Immediately fetch user data using /me API
      // console.log("🔍 Fetching user data from /me API...");
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

      // console.log("✅ User data fetched:", user);

      // Save user to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(user));
      }

      // Update state with complete user data
      set({
        user,
        loading: false,
        isAuthenticated: true,
        isInitialized: true,
      });

      // console.log("✅ Login complete with user data");
      return true;
    } catch (err) {
      console.error("❌ Login error:", err);
      set({ loading: false });
      return false;
    }
  },

  checkSession: async () => {

    const token = localStorage.getItem("auth_token")
    // const token = get().token;

    if (!token) {
      // console.log("❌ No token to check");
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }

    // console.log("🔍 Checking session...");

    try {
      const res = await fetch(`${API}/v2/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Tenant": "nextshop",
        },
      });

      if (!res.ok) {
        // console.log("❌ Session invalid");

        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }

        set({ user: null, token: null, isAuthenticated: false });
        return;
      }

      const data = await res.json();
      console.log(data.data.role)
      if(data.data.role==="admin"){
        set({
          isAdmin: true
        })
      } else {
        set({
          isAdmin: false
        })
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(data.data));
      }

      set({ user: data.data, isAuthenticated: true });
      // console.log("✅ Session valid");
    } catch (err) {
      console.error("❌ Session check error:", err);

      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }

      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  logout: () => {
    // console.log("🚪 Logging out...");

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }

    set({ user: null, token: null, isAuthenticated: false });
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
