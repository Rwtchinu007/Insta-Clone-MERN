import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import { loginUser, registerUser, getMe } from "../services/auth.api.js";

// Centralized auth hook: performs API calls and updates context state.
export function useAuth() {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading, } =
    context;

  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      const userData = await loginUser(username, password);
      setUser(userData.user);
      return userData;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const userData = await registerUser(username, email, password);
      setUser(userData.user);
      return userData;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleLogin, handleRegister, setUser };
}
