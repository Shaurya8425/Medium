import { useState, useEffect } from "react";
import apiClient, { AUTH_STATE_CHANGED } from "./api-client";

interface User {
  name: string;
  username: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleAuthStateChange = (event: CustomEvent) => {
      if (!event.detail.isAuthenticated) {
        setUser(null);
        localStorage.removeItem("user");
      } else {
        fetchUserInfo();
      }
    };

    // Initial fetch if token exists
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo();
    }

    // Listen for auth state changes
    window.addEventListener(
      AUTH_STATE_CHANGED,
      handleAuthStateChange as EventListener
    );

    return () => {
      window.removeEventListener(
        AUTH_STATE_CHANGED,
        handleAuthStateChange as EventListener
      );
    };
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await apiClient.get("/api/v1/user/me");
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return { user };
}
