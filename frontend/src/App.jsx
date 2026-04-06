import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import TeamBuilderPage from "./pages/TeamBuilderPage";
import TeamEditorPage from "./pages/TeamEditorPage";
import AdminPage from "./pages/AdminPage";
import ViewTeamPage from './pages/ViewTeamPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
     <Routes>
          <Route path="/" element={<LoginPage />} />

    <Route path="/team-build" element={
            <ProtectedRoute><TeamBuilderPage /></ProtectedRoute>
          } />

          <Route path="/edit-team" element={
            <ProtectedRoute><TeamEditorPage /></ProtectedRoute>
          } />
     <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>
          } />
          <Route path="/view-team" element={
             <ProtectedRoute><ViewTeamPage /></ProtectedRoute>
            } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
