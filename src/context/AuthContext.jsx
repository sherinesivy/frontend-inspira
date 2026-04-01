import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("inspira-user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("inspira-token") || null;
  });

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("inspira-user", JSON.stringify(userData));
    localStorage.setItem("inspira-token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("inspira-user");
    localStorage.removeItem("inspira-token");
  };

  const updateProfilePic = async (file) => {
    const formData = new FormData();
    formData.append("profilePic", file);
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/auth/profile-pic`,
      formData,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
    );
    const updatedUser = { ...user, profilePic: res.data.profilePic };
    setUser(updatedUser);
    localStorage.setItem("inspira-user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateProfilePic }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}