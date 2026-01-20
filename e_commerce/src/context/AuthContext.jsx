import React, { createContext, useContext, useState, useEffect } from "react";
 
const AuthContext = createContext();
 
export const useAuth = () => useContext(AuthContext);
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
 
  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
 
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("activeUser", JSON.stringify(userData));
  };
 
  const logout = () => {
    setUser(null);
    localStorage.removeItem("activeUser");
 
    // localStorage.removeItem('eshop_cart');
  };
 
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
 