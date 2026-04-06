import { useState } from "react";
import { useEffect } from "react";

const mockUsers = [
  { _id: "1", username: "ashKetchum", role: "user" },
  { _id: "2", username: "barry", role: "user" },
  { _id: "3", username: "glacia", role: "user" },
  { _id: "4", username: "hala", role: "admin" },
];

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Could not load users:", err));
  }, []);

  const handleDelete = async (userId, username) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${username}"?`
    );
  

    //swap this out for real API cals from backend
    // wait for the api.delete(`/users/${userId}`)
    setUsers(users.filter((u) => u._id !== userId));
    setMessage(`User "${username}" deleted.`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the user from the local state list
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

      {message && (
        <div style={{
          background: "#d4edda", color: "#155724",
          padding: "0.75rem 1rem", borderRadius: "6px",
          marginBottom: "1rem"
        }}>
          {message}
        </div>
      )}

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
