import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import ChatApp from "./Components/ChatApp";
import ProtectedRoute from "./ProtectedRoutes";
import SignUpPage from "./Components/SignUpPage";
import LoginPage from "./Components/LoginPage";

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
