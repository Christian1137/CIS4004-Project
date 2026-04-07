import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Common style for the new navigation buttons
  const navButtonStyle = {
    cursor: "pointer",
    background: "#fff",
    color: "#cc0000",
    border: "none",
    padding: "8px 15px",
    borderRadius: "20px",
    fontWeight: "bold",
    textDecoration: "none", // Removes underline from Link
    fontSize: "0.9rem",
    display: "inline-block"
  };

  return (
    <nav style={{
      padding: "0.75rem clamp(0.75rem, 2vw, 2rem)",
      background: "#cc0000",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "0.5rem",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      position: "relative"
    }}>

      <span style={{ fontWeight: "bold", fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)", lineHeight: "1.3", wordWrap: "break-word", flexShrink: 0 }}>
        Pokémon Team Builder
      </span>

      {user && (
        <span style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontWeight: "bold",
          fontSize: "clamp(0.75rem, 2vw, 1.3rem)",
          lineHeight: "1.3",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          maxWidth: "40%",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          Welcome {user.username}!
        </span>
      )}

      {/* nav buttons*/}
      <div style={{ display: "flex", gap: "clamp(0.4rem, 1vw, 1rem)", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
        {user && (
          <>
          {/* special admin button */}
            {user.role === "Administrator" && (
              <Link to="/admin" style={{ 
                color: "white", 
                textDecoration: "none", 
                fontWeight: "bold", 
                background: "#ff4d4d", 
                padding: "5px 10px", 
                borderRadius: "5px" 
              }}>
                Admin
              </Link>
            )}
            {/* Draft Button */}
            <Link to="/team-build" style={navButtonStyle}>
              Draft
            </Link>

            {/* My Team Button */}
            <Link to="/view-team" style={navButtonStyle}>
              My Team
            </Link>

            {/* Profile Button */}
            <Link to="/profile" style={navButtonStyle}>
              Profile
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={navButtonStyle}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}