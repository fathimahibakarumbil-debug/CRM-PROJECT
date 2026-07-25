import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
const ProtectedRoute = ({ children, roles = [] }) => {
  const { token, role } = useSelector((state) => state.auth);

  // Not logged in
  if (!token) return <Navigate to="/login" replace />;

  // Role check (if roles are specified)
  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />; // Redirect unauthorized users
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;