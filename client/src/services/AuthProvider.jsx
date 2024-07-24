import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [expirationTime, setExpirationTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken) => {
    const expiration = new Date().getTime() + 60 * 60 * 1000;
    setToken(newToken);
    setExpirationTime(expiration);
    sessionStorage.setItem("token", newToken);
    navigate("/admin", { replace: true });
  };

  const logout = () => {
    setToken(null);
    setExpirationTime(null);
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ token, expirationTime, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);