import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import LoginPage from "./components/LoginPage";
import ChatApp from "./components/ChatApp";
import ProtectedRoute from "./ProtectedRoutes";
import SignUpPage from "./components/SignUpPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute children={<RootLayout />} />,
    children: [
      {
        index: true,
        element: <ProtectedRoute children={<ChatApp />} />,
      },
    ],
  },
]);

export default router;
