import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const apiBase = process.env.REACT_APP_VERCEL_DOMAIN;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(() => {
    fetch(`${apiBase}/api/auth/check-auth`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        setIsAuthenticated(Boolean(data.authenticated));
        setLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  const login = async (username, password) => {
    const response = await fetch(`${apiBase}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      return;
    }

    let message = "Invalid credentials";
    try {
      const data = await response.json();
      if (data?.message && typeof data.message === "string") {
        message = data.message;
      }
    } catch {
      /* ignore */
    }
    throw new Error(message);
  };

  const logout = async () => {
    try {
      await fetch(`${apiBase}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      /* still clear client state if network fails */
    }
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Only logged-in admins need the session re-checked; shoppers get a single check.
  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const interval = setInterval(checkAuthStatus, 300000);
    return () => clearInterval(interval);
  }, [isAuthenticated, checkAuthStatus]);

  // Render right away so public pages don't wait on the auth check; admin pages use `loading`.
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
