import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
//simple temp with navigation bar
  return (
    <nav style={{ padding: "1rem", background: "#cc0000", color: "white",
      display: "flex", gap: "1rem", alignItems: "center" }}>
      <span style={{ fontWeight: "bold", marginRight: "auto" }}>Pokemon Team Builder</span>

      {user && (
        <>
          <Link to="/team" style={{ color: "white" }}>My Team</Link>
          {user.role === "admin" && (
            <Link to="/admin" style={{ color: "white" }}>Admin</Link>
          )}
          <button onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout ({user.username})
          </button>
        </>
      )}
    </nav>
  );
}
