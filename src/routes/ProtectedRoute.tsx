import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../interfaces";


const ProtectedRoute = ({ allowedRoles }: { allowedRoles: Role[] }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return;

  if (!user) return <Navigate to="/auth" replace />; // Redirect to login if not authenticated
  if (!user.role || !allowedRoles.includes(user.role))
    return <Navigate to="/404" replace />; // Redirect if unauthorized

  return <Outlet />;
};

export default ProtectedRoute;
