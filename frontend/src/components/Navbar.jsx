import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{
      padding: "1rem 2rem",
      background: "#cc0000",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between", // Spreads the left and right sides
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      position: "relative" // Required for the absolute centering below!
    }}>

      {/* LEFT SIDE: App Title */}
      <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Pokémon Team Builder
      </span>

      {/* CENTER SIDE: Perfectly centered welcome message */}
      {user && (
        <span style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)", // Pulls it back exactly halfway to center it
          fontWeight: "bold",
          fontSize: "1.3rem"
        }}>
          Welcome {user.username}!
        </span>
      )}

      {/* RIGHT SIDE: Navigation Links & Logout */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        {user && (
          <>
            <Link to="/team-build" style={{ color: "white", textDecoration: "none", fontWeight: "500" }}>Build Team</Link>
            <Link to="/view-team" style={{ color: "white", textDecoration: "none", fontWeight: "500" }}>View My Team</Link>

            {user.role === "Administrator" && (
              <Link to="/admin" style={{ color: "white", textDecoration: "none", fontWeight: "bold", background: "#ff4d4d", padding: "5px 10px", borderRadius: "5px" }}>
                Admin
              </Link>
            )}

            {user.role !== "Administrator" && (
              <button
                onClick={async () => {
                  if (window.confirm("WARNING: This will permanently delete your account and all your teams. Are you sure?")) {
                    try {
                      await fetch(`/api/admin/users/${user.userId}`, { method: 'DELETE' });
                      logout();
                    } catch (err) {
                      console.error("Failed to delete account", err);
                    }
                  }
                }}
                style={{
                  cursor: "pointer",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "20px",
                  fontWeight: "bold"
                }}
              >
                Delete My Account
              </button>
            )}

            <button
              onClick={handleLogout}
              style={{
                cursor: "pointer",
                background: "#fff",
                color: "#cc0000",
                border: "none",
                padding: "8px 15px",
                borderRadius: "20px",
                fontWeight: "bold"
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}