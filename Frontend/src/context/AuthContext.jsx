import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL = "http://localhost:5000";

// Ensure credentials (cookies) are always included in API requests
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/auth/me`);

        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        console.error(
          "Auth Check Failed:",
          error.response?.data?.message || error.message
        );

        if (error.message === "Network Error") {
          alert(
            "Cannot connect to server. Please check if the backend is running."
          );
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
          setUser(null);
          localStorage.removeItem("user");
          sessionStorage.clear();
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token); // ✅ Store token for secure API calls

      return data.user;
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error(
        "Registration Error:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`);
      setUser(null);
      localStorage.removeItem("user");
      sessionStorage.clear();
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {loading ? (
        <div className="text-center p-6">Checking authentication...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
