import { useState } from "react";

const mockUsers = [
  { _id: "1", username: "jordan", role: "user" },
  { _id: "2", username: "andy", role: "user" },
  { _id: "3", username: "christian", role: "user" },
  { _id: "4", username: "admin", role: "admin" },
];

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers);
  const [message, setMessage] = useState("");

  const handleDelete = (userId, username) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${username}"?`
    );
    if (!confirmed) return;

    //swap this out for real API cals from backend
    // wait for the api.delete(`/users/${userId}`)
    setUsers(users.filter((u) => u._id !== userId));
    setMessage(`User "${username}" deleted.`);
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
                  background: u.role === "admin" ? "#cc0000" : "#e0e0e0",
                  color: u.role === "admin" ? "white" : "#333"
                }}>
                  {u.role}
                </span>
              </td>
              <td style={td}>
                {u.role !== "admin" && (
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
