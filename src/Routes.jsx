import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import ChatApp from "./components/ChatApp";
import ProtectedRoute from "./ProtectedRoutes";

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
