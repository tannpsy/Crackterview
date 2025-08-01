
import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// ✅ ProtectedRoute component
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export const AuthProvider = ({ children }) => {
  const safeParse = (json) => {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
  const storedRefreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
  const storedUser = safeParse(localStorage.getItem("user")) || safeParse(sessionStorage.getItem("user"));

  const [token, setToken] = useState(storedToken || null);
  const [refreshToken, setRefreshToken] = useState(storedRefreshToken || null);
  const [user, setUser] = useState(storedUser || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);
  const [authLoading, setAuthLoading] = useState(false);

  // ✅ Centralized function to store auth data
  const saveAuthData = (accessToken, refreshToken, userData, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", accessToken);
    if (refreshToken) storage.setItem("refreshToken", refreshToken);
    storage.setItem("user", JSON.stringify(userData));

    setToken(accessToken);
    setRefreshToken(refreshToken || null);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearAuthData = () => {
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const getExpiry = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);
      return decoded.exp ? decoded.exp * 1000 : null;
    } catch {
      return null;
    }
  };

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.error || "Failed to refresh");

      const storage = localStorage.getItem("refreshToken") ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      setToken(data.token);

      return true;
    } catch (err) {
      console.error("Refresh token failed", err);
      clearAuthData();
      return false;
    }
  }, [refreshToken]);

  // ✅ Auto refresh token if near expiry
  useEffect(() => {
    if (!token) return;
    const expiry = getExpiry(token);
    if (!expiry) return;

    const now = Date.now();
    const timeout = expiry - now - 60 * 1000;

    if (timeout <= 0) {
      refreshAccessToken();
      return;
    }

    const timer = setTimeout(refreshAccessToken, timeout);
    return () => clearTimeout(timer);
  }, [token, refreshAccessToken]);

  // ✅ Login now automatically saves user data properly
  const login = useCallback(async (email, password, rememberMe) => {
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.token) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ Normalize user data
      const userData = data.user
        ? data.user
        : {
            _id: data._id,
            username: data.username,
            email: data.email,
            isHR: data.isHR,
          };

      // ✅ Store everything in one place
      saveAuthData(data.token, data.refreshToken || null, userData, rememberMe);

      message.success("Login successful!");
      return true;
    } catch (err) {
      message.error(err.message || "Login failed");
      clearAuthData();
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST" });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      message.success("Logged out!");
      clearAuthData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
