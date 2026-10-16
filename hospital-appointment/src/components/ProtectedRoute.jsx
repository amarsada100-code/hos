import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { token, expiresAt } = useSelector(
    (state) => state.auth
  );

  const isAuthenticated =
    Boolean(token) &&
    Boolean(expiresAt) &&
    expiresAt > Date.now();

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}