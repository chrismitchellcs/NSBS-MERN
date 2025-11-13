import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthStatus = () => {
    fetch(`${process.env.REACT_APP_VERCEL_DOMAIN}/api/auth/check-auth`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setLoading(false);
      });
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_VERCEL_DOMAIN}/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
    } catch (err) {
      setError(err);
      console.error("Login error:", err);
      throw new Error("Login failed");
    }
  };

  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 300000); // check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, loading, error }}>
      {!loading && children}
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
