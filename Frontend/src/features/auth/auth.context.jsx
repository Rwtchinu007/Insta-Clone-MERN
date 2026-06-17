  import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe } from "./services/auth.api";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const userData = await loginUser(username, password);
      setUser(userData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, password) => {
    setLoading(true);
    try {
      const userData = await registerUser(username, password);
      setUser(userData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleRegister }}>
      {children}
    </AuthContext.Provider>
  ); 
};
