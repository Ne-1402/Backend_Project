import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// usage: <ProtectedRoute roles={["editor"]}> ... </ProtectedRoute>
export default function ProtectedRoute({ roles, children }) {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;

  return children;
}