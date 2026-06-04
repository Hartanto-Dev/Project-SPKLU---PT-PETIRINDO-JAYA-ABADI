import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, ChevronDown, LayoutDashboard, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PetirindoLogo from './PetirindoLogo';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isLoggedIn, isAdmin, currentUser, logout, profileName, profilePhoto } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  // Get initials for avatar
  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <PetirindoLogo size={38}/>
          <span className="logo-text">PETIRINDO SPKLU</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-links desktop-only">
          <li><Link to="/" className="nav-link">HOME</Link></li>
          <li><Link to="/dashboard" className="nav-link">DASHBOARD</Link></li>
          <li><Link to="/about" className="nav-link">ABOUT US</Link></li>
          <li><Link to="/contacts" className="nav-link">CONTACTS</Link></li>
          {isAdmin && (
            <>
              <li><Link to="/admin/dashboard" className="nav-link nav-link-admin">ADMIN</Link></li>
            </>
          )}
        </ul>

        {/* Auth Section (Desktop) */}
        <div className="navbar-auth desktop-only">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn-outline">Sign In</Link>
              <Link to="/login" className="btn-primary">Sign Up</Link>
            </>
          ) : (
            <div className="profile-wrapper" ref={profileRef}>
              <button className="profile-trigger" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="profile-avatar">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    getInitials(currentUser?.email)
                  )}
                </div>
                <ChevronDown size={16} className={`chevron ${isProfileOpen ? 'rotated' : ''}`} />
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="profile-avatar-lg">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        getInitials(currentUser?.email)
                      )}
                    </div>
                    <div>
                      {profileName && <p className="dropdown-name">{profileName}</p>}
                      <p className="dropdown-email">{currentUser?.email}</p>
                      <span className="dropdown-role">{currentUser?.role}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  {isAdmin && (
                    <>
                      <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                      <Link to="/admin/users" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        <Users size={16} /> Kelola User
                      </Link>
                      <div className="dropdown-divider"></div>
                    </>
                  )}
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <User size={16} /> Edit Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <Settings size={16} /> Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn mobile-only"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-links">
            <li><Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>HOME</Link></li>
            <li><Link to="/dashboard" className="mobile-link" onClick={() => setIsMenuOpen(false)}>DASHBOARD</Link></li>
            <li><Link to="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>ABOUT US</Link></li>
            <li><Link to="/contacts" className="mobile-link" onClick={() => setIsMenuOpen(false)}>CONTACTS</Link></li>
            {isAdmin && (
              <>
                <li><Link to="/admin/dashboard" className="mobile-link mobile-link-admin" onClick={() => setIsMenuOpen(false)}>ADMIN DASHBOARD</Link></li>
                <li><Link to="/admin/users" className="mobile-link mobile-link-admin" onClick={() => setIsMenuOpen(false)}>KELOLA USER</Link></li>
              </>
            )}
          </ul>
          <div className="mobile-auth">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="btn-outline full-width" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                <Link to="/login" className="btn-primary full-width" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <div className="mobile-profile-section">
                <div className="mobile-profile-info">
                  <div className="profile-avatar">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      getInitials(currentUser?.email)
                    )}
                  </div>
                  <div>
                    <p className="mobile-profile-email">{currentUser?.email}</p>
                    <span className="mobile-profile-role">{currentUser?.role}</span>
                  </div>
                </div>
                <button className="btn-outline full-width mobile-logout-btn" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
