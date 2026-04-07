import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  // Username State
  const [username, setUsername] = useState(user?.username || "");
  const [usernameMessage, setUsernameMessage] = useState({ type: "", text: "" });

  // Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  // --- HANDLERS ---

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setUsernameMessage({ type: "", text: "" }); // Clear old messages

    try {
      const response = await fetch(`http://localhost:5001/api/users/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update username");
      }

      // Update local storage and context so Navbar updates instantly
      localStorage.setItem('currentUsername', username);
      login({ ...user, username: username });

      setUsernameMessage({ type: "success", text: "Username updated successfully!" });
    } catch (error) {
      setUsernameMessage({ type: "error", text: error.message });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" }); // Clear old messages

    // 1. Check if new passwords match before sending to server
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/users/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      
      // Clear the form fields on success
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage({ type: "error", text: error.message });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure? This will permanently delete your account and all your Pokémon teams."
    );

    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${user.userId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Network response was not ok");

        logout();
        navigate("/");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Could not delete account. Please try again later.");
      }
    }
  };

  // --- STYLES ---
  const containerStyle = {
    maxWidth: "500px",
    margin: "3rem auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    fontFamily: "sans-serif"
  };

  const sectionStyle = {
    marginBottom: "2rem",
    padding: "1.5rem",
    border: "1px solid #eaeaea",
    borderRadius: "8px",
    backgroundColor: "#fafafa"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0 16px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#cc0000",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem"
  };

  // Helper component to render messages cleanly
  const AlertMessage = ({ message }) => {
    if (!message.text) return null;
    return (
      <div style={{
        padding: "10px",
        marginBottom: "1rem",
        borderRadius: "5px",
        backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
        color: message.type === "success" ? "#155724" : "#721c24",
        textAlign: "center",
        fontSize: "0.9rem"
      }}>
        {message.text}
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "1.5rem" }}>
        Account Settings
      </h2>

      {/* USERNAME SECTION */}
      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#444" }}>Change Username</h3>
        <AlertMessage message={usernameMessage} />
        <form onSubmit={handleUpdateUsername}>
          <label style={{ fontWeight: "bold", fontSize: "0.9rem" }}>New Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>Update Username</button>
        </form>
      </div>

      {/* PASSWORD SECTION */}
      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#444" }}>Change Password</h3>
        <AlertMessage message={passwordMessage} />
        <form onSubmit={handleUpdatePassword}>
          <label style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Current Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <label style={{ fontWeight: "bold", fontSize: "0.9rem" }}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <label style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle}>Update Password</button>
        </form>
      </div>

      <hr style={{ margin: "2rem 0", border: "0", borderTop: "1px solid #eee" }} />

      {/* DELETE SECTION */}
      <div style={{ textAlign: "center" }}>
        <button onClick={handleDeleteAccount} style={{
          width: "100%", padding: "10px", backgroundColor: "transparent",
          color: "#cc0000", border: "2px solid #cc0000", borderRadius: "5px",
          fontWeight: "bold", cursor: "pointer", marginTop: "0.5rem"
        }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}