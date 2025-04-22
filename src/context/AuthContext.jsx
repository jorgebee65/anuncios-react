import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const baseUrl = window?.env?.VITE_API_URL || "http://perro:8585";
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const isAuthenticated = !!token;

  const login = async (credentials) => {
    const response = await axios.post(
      `${baseUrl}/api/v1/auth/login`,
      credentials
    );
    const newToken = response.data.token;
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    // No navegues aquí
  };

  const fetchUser = async () => {
    try {
      if (token) {
        const res = await axios.get(`${baseUrl}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      }
    } catch {
      logout(); // Token inválido → forzar logout
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
