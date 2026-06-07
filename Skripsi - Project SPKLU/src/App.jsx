import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import EditProfilePage from './pages/EditProfilePage';
import SettingsPage from './pages/SettingsPage';

// Pages that show full-screen without navbar/footer
const FULLSCREEN_PAGES = ['/login', '/register'];

const AppLayout = () => {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_PAGES.includes(location.pathname);

  return (
    <div className="app-container">
      {!isFullscreen && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/profile" element={<EditProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      {!isFullscreen && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;
