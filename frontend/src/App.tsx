import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useEffect } from "react";
import LandingPage from "@/pages/LandingPage";
// import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import { ROUTES } from "@/constants/routes";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import PublicRoute from "@/components/routing/PublicRoute";
import { useThemeStore } from "./stores/useThemeStore";

const App = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");

    root.classList.add(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes that doesn't need auth */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />

        <Route
          path={ROUTES.HOME}
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes that require AUTH  */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
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
