import React, { JSX, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useRequireAuth, useRedirectIfAuthenticated } from "../hooks/useAuth";
import FullPageLoader from "../components/common/Loader";

//lazy loading
const Login = React.lazy(() => import("../components/login"));
const Users = React.lazy(() => import("../components/users"));

const ProtectedRoute: React.FC<{
  children: JSX.Element;
  redirectTo?: string;
}> = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated } = useRequireAuth(redirectTo);
  if (!isAuthenticated) return null;
  return children;
};

const PublicRoute: React.FC<{ children: JSX.Element; redirectTo?: string }> = ({
  children,
  redirectTo = "/users",
}) => {
  const { isAuthenticated } = useRedirectIfAuthenticated(redirectTo);
  if (isAuthenticated) return null;
  return children;
};

//protected router based on auth token
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter basename={'/mallow_react_task_dineshkumar'}>
      <Suspense fallback={<FullPageLoader visible={true} />}>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
