import { router } from "./AppRoutes";
import { RouterProvider } from "react-router";
import "./features/shared/global.scss";
import { AuthProvider } from "./features/auth/auth.context.jsx";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
