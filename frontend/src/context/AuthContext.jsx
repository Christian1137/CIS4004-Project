import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 1. Initialize state by checking localStorage first!
  const [user, setUser] = useState(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    const savedUsername = localStorage.getItem('currentUsername');
    const savedRole = localStorage.getItem('currentUserRole');

    // If an ID exists in the browser memory, automatically log them in
    if (savedUserId) {
      return { 
        userId: savedUserId, 
        username: savedUsername, 
        role: savedRole 
      };
    }
    return null; // Otherwise, start as logged out
  });

  // Login just updates the React state (LoginPage handles the localStorage saving)
  const login = (userData) => {
    setUser(userData);
  };

  // 2. Logout clears the state AND wipes the browser memory
  const logout = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUsername');
    localStorage.removeItem('currentUserRole');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}