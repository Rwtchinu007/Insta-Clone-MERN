import { router } from "./AppRoutes";
import { RouterProvider } from "react-router";
import "./features/shared/global.scss";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import {PostContextProvider} from "./features/post/post.context.jsx";

const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
        <RouterProvider router={router} />
      </PostContextProvider>
    </AuthProvider>
  );
};

export default App;
