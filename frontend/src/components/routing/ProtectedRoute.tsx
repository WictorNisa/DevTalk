import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = !!user;

  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;
