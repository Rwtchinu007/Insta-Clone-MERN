import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../../auth/auth.context";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Kick them to login if they aren't authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;