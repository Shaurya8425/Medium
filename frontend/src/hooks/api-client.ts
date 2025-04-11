import axios from "axios";
import { BACKEND_URL } from "../config";

const apiClient = axios.create({
  baseURL: BACKEND_URL,
});

// Custom event for auth state changes
export const AUTH_STATE_CHANGED = "auth_state_changed";

// Helper function to dispatch auth state changes
const dispatchAuthStateChange = (
  isAuthenticated: boolean,
  error: string | null = null
) => {
  window.dispatchEvent(
    new CustomEvent(AUTH_STATE_CHANGED, { detail: { isAuthenticated, error } })
  );
};

// Helper function to handle token validation
export const validateToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    dispatchAuthStateChange(false, null);
    return false;
  }

  try {
    await apiClient.get("/api/v1/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatchAuthStateChange(true, null);
    return true;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatchAuthStateChange(false, "Authentication failed");
    } else {
      dispatchAuthStateChange(false, "Connection error. Please try again.");
    }
    return false;
  }
};

// Auth helper functions
export const login = (token: string) => {
  localStorage.setItem("token", token);
  dispatchAuthStateChange(true, null);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatchAuthStateChange(false, null);
};

// Helper function to get current auth state
export const getAuthState = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.headers?.["X-Public-Route"]
    ) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
