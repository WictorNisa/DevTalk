import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import { ROUTES } from "@/constants/routes";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import PublicRoute from "@/components/routing/PublicRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes that doesn't need auth */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        {/* testetstetst */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes that require AUTH  */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            //<ProtectedRoute>
            <Dashboard />
            //</ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.CHANNEL}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 NOT FOUND */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
