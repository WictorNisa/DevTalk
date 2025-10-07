import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate } from "react-router";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = !!user;
  //If user is authed, redirect to dashboard or home
  return isAuthenticated ? (
    <Navigate to={ROUTES.DASHBOARD} replace />
  ) : (
    //If user is not authed, allow access to public route
    <>{children}</>
  );
};

export default PublicRoute;
