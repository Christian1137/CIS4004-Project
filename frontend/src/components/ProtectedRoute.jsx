import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

        export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

       if (!user) return <Navigate to="/" />;
  if (adminOnly && user.role !== "Administrator") return <Navigate to="/team" />;

  return children;
} //req for route
