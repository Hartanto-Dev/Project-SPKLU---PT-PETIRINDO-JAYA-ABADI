import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

// Initial dummy users
const INITIAL_USERS = [
  { id: 1, email: 'admin12345@gmail.com', password: 'admin12345', role: 'Admin' },
  { id: 2, email: 'user12345@gmail.com', password: 'user12345', role: 'User' },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [nextId, setNextId] = useState(3);
  const [profileName, setProfileName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync dark mode class on document.body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const login = useCallback((email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser({ id: user.id, email: user.email, role: user.role });
      return { success: true, role: user.role };
    }
    return { success: false, role: null };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addUser = useCallback((email, password, role = 'User') => {
    const exists = users.some(u => u.email === email);
    if (exists) return { success: false, message: 'Email sudah terdaftar' };
    
    const newUser = { id: nextId, email, password, role };
    setUsers(prev => [...prev, newUser]);
    setNextId(prev => prev + 1);
    return { success: true, message: 'User berhasil ditambahkan' };
  }, [users, nextId]);

  const editUser = useCallback((id, updates) => {
    if (updates.email) {
      const exists = users.some(u => u.email === updates.email && u.id !== id);
      if (exists) return { success: false, message: 'Email sudah digunakan' };
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    return { success: true, message: 'User berhasil diperbarui' };
  }, [users]);

  const deleteUser = useCallback((id) => {
    if (currentUser && currentUser.id === id) {
      return { success: false, message: 'Tidak bisa menghapus akun sendiri' };
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    return { success: true, message: 'User berhasil dihapus' };
  }, [currentUser]);

  const updateProfile = useCallback((name, photo) => {
    setProfileName(name);
    if (photo !== undefined) setProfilePhoto(photo);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    isAdmin: currentUser?.role === 'Admin',
    users,
    login,
    logout,
    addUser,
    editUser,
    deleteUser,
    profileName,
    profilePhoto,
    updateProfile,
    isDarkMode,
    toggleDarkMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
