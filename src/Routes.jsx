import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import ChatApp from "./components/ChatApp";
import ChatIntro from "./Utils/WelcomePage";
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
      // {
      //   index: true,
      //   element: <ProtectedRoute children={<ChatIntro />} />,
      // },
      {
        index: true,
        element: <ProtectedRoute children={<ChatApp />} />,
      },
    ],
  },
]);

export default router;
