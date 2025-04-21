// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ children }) => {
//   const { isAuth, isLoading } = useSelector((state) => state.auth);
//   // const isAuth = useSelector((state) => state.auth.isAuth);
//   console.log("🔒 ProtectedRoute Rendering - isAuth:", isAuth);

//   if (isLoading) return <div>Loading...</div>;
//   // if (isAuth === undefined) return <div>Loading...</div>;

//   return isAuth ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isAuth, isLoading } = useSelector((state) => state.auth);
  // console.log("🔒 ProtectedRoute Rendering - isAuth:", isAuth);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect if isAuth is falsy (false, null, undefined, 0, etc.)
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
