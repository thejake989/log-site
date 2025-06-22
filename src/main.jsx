// Updated main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import ScoreEntry from "./pages/ScoreEntry.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import Profile from "./pages/Profile.jsx";
import Members from "./pages/Members.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CommissionerRoute from "./components/CommissionerRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <CommissionerRoute>
                  <Admin />
                </CommissionerRoute>
              }
            />
            <Route
              path="/scores"
              element={
                <CommissionerRoute>
                  <ScoreEntry />
                </CommissionerRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <StatsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/members"
              element={
                <ProtectedRoute>
                  <Members />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </App>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
