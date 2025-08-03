import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import FolderPage from './components/Folder/FolderPage';
import PlaylistPage from './components/Playlist/PlaylistPage';

function App() {
  const { user, loading } = useAuth();

  console.log('App render - user:', user?.email || 'No user', 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/folder/:folderId" element={user ? <FolderPage /> : <Navigate to="/login" replace />} />
        <Route path="/playlist/:playlistId" element={user ? <PlaylistPage /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
