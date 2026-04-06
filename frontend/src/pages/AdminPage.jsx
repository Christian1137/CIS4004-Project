import { useState, useEffect } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // for user creaton
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("Trainer");
  const [createMessage, setCreateMessage] = useState("");

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Could not load users:", err));
  }, []);


  const handleCreateUser = async () => {
    if (!newUsername || !newPassword) {
      setCreateMessage("Please fill in both fields.");
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole })
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
        setCreateMessage(`User "${newUsername}" created successfully!`);
        setNewUsername("");
        setNewPassword("");
        setNewRole("Trainer");
      } else {
        setCreateMessage("Failed to create user. Username may already exist.");
      }
    } catch (err) {
      console.error("Create error:", err);
      setCreateMessage("Something went wrong.");
    }
  };
  const handleDelete = async (userId, username) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${username}"?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      //Remove the user from the local state list
      if (response.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        setMessage(`User "${username}" deleted.`);
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "Administrator" ? "Trainer" : "Administrator";
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        setMessage(`Role updated to ${newRole}`);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Admin Dashboard</h2>
      <p style={{ color: "gray" }}>Manage all registered users below.</p>

      {/* create sec */}
      <div style={{
        background: "#f9f9f9", border: "1px solid #ddd",
        borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem"
      }}>
        <h3 style={{ marginTop: 0 }}>Create New User</h3>

        {createMessage && (
          <div style={{
            background: "#d4edda", color: "#155724",
            padding: "0.75rem 1rem", borderRadius: "6px", marginBottom: "1rem"
          }}>
            {createMessage}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="Trainer">Trainer</option>
            <option value="Administrator">Administrator</option>
          </select>
          <button
            onClick={handleCreateUser}
            style={{
              background: "#cc0000", color: "white", border: "none",
              padding: "8px 16px", borderRadius: "4px", cursor: "pointer",
              fontWeight: "bold", width: "fit-content"
            }}
          >
            Create User
          </button>
        </div>
      </div>

      {/* for updaye message*/}
      {message && (
        <div style={{
          background: "#d4edda", color: "#155724",
          padding: "0.75rem 1rem", borderRadius: "6px",
          marginBottom: "1rem"
        }}>
          {message}
        </div>
      )}

      {/* user table*/}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0", textAlign: "left" }}>
            <th style={th}>Username</th>
            <th style={th}>Role</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={td}>{u.username}</td>
              <td style={td}>
                <span style={{
                  padding: "2px 10px", borderRadius: "12px", fontSize: "12px",
                  background: u.role === "Administrator" ? "#cc0000" : "#e0e0e0",
                  color: u.role === "Administrator" ? "white" : "#333"
                }}>
                  {u.role}
                </span>
              </td>
              <td style={td}>
                <button
                  onClick={() => handleRoleToggle(u._id, u.role)}
                  style={{ marginRight: "10px", cursor: "pointer" }}
                >
                  Toggle Role
                </button>
                {u.role !== "Administrator" && (
                  <button
                    onClick={() => handleDelete(u._id, u.username)}
                    style={{
                      background: "#cc0000", color: "white",
                      border: "none", padding: "4px 12px",
                      borderRadius: "4px", cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "10px 12px" };
const td = { padding: "10px 12px" };
