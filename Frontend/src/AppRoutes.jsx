import { createBrowserRouter } from "react-router"; // Use react-router-dom
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Feed from "./features/post/pages/Feed.jsx";
import CreatePost from "./features/post/pages/CreatePost.jsx";
import Profile from "./features/profile/pages/Profile.jsx";
import ProtectedRoute from "./features/shared/components/ProtectedRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    // WRAP PROTECTED ROUTES LIKE THIS:
    element: <ProtectedRoute><Feed /></ProtectedRoute>,
  },
  {
    path: "/create-post",
    element: <ProtectedRoute><CreatePost /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  }
]);