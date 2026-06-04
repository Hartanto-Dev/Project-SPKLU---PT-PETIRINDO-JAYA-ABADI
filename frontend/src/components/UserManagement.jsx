import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Pencil, Trash2, X, Check, AlertCircle, ArrowLeft, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './UserManagement.css';

const UserManagement = () => {
  const { users, addUser, editUser, deleteUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'User' });
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ email: '', password: '', role: 'User' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setEditingUser(user);
    setFormData({ email: user.email, password: '', role: user.role });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email.trim()) { setFormError('Email wajib diisi'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setFormError('Format email tidak valid'); return; }

    if (modalMode === 'add') {
      if (!formData.password.trim()) { setFormError('Password wajib diisi'); return; }
      if (formData.password.length < 6) { setFormError('Password minimal 6 karakter'); return; }
      const result = addUser(formData.email, formData.password, formData.role);
      if (!result.success) { setFormError(result.message); return; }
      showToast('User baru berhasil ditambahkan!');
    } else {
      const updates = { email: formData.email, role: formData.role };
      if (formData.password.trim()) {
        if (formData.password.length < 6) { setFormError('Password minimal 6 karakter'); return; }
        updates.password = formData.password;
      }
      const result = editUser(editingUser.id, updates);
      if (!result.success) { setFormError(result.message); return; }
      showToast('User berhasil diperbarui!');
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    const result = deleteUser(id);
    if (result.success) {
      showToast('User berhasil dihapus!');
    } else {
      showToast(result.message, 'error');
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="user-management">
      <div className="um-container">
        {/* Header */}
        <div className="um-header">
          <div className="um-header-left">
            <Link to="/admin/dashboard" className="um-back-btn"><ArrowLeft size={18} /> Dashboard</Link>
            <h1><Users size={28} /> Manajemen User</h1>
            <p>Kelola semua akun pengguna sistem</p>
          </div>
          <button className="um-add-btn" onClick={openAddModal}>
            <UserPlus size={18} /> Tambah User Baru
          </button>
        </div>

        {/* Stats */}
        <div className="um-stats">
          <div className="um-stat-item">
            <span className="stat-num">{users.length}</span>
            <span className="stat-label">Total User</span>
          </div>
          <div className="um-stat-item">
            <span className="stat-num">{users.filter(u => u.role === 'Admin').length}</span>
            <span className="stat-label">Admin</span>
          </div>
          <div className="um-stat-item">
            <span className="stat-num">{users.filter(u => u.role === 'User').length}</span>
            <span className="stat-label">User</span>
          </div>
        </div>

        {/* Table */}
        <div className="um-table-wrapper">
          <table className="um-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="td-id">#{user.id}</td>
                  <td className="td-email">
                    <div className="user-avatar" style={{ background: user.role === 'Admin' ? '#ede9fe' : '#e0f2fe' }}>
                      {user.role === 'Admin' ? <Shield size={14} style={{ color: '#7c3aed' }} /> : <UserIcon size={14} style={{ color: '#0284c7' }} />}
                    </div>
                    {user.email}
                  </td>
                  <td>
                    <span className={`role-badge ${user.role === 'Admin' ? 'role-admin' : 'role-user'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button className="action-btn edit-btn" onClick={() => openEditModal(user)} title="Edit"><Pencil size={15} /></button>
                    <button className="action-btn delete-btn" onClick={() => setDeleteConfirm(user.id)} title="Hapus"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`um-toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
            {toast.message}
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm !== null && (
          <div className="um-modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="um-confirm-box" onClick={e => e.stopPropagation()}>
              <Trash2 size={32} className="confirm-icon" />
              <h3>Hapus User?</h3>
              <p>Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="confirm-actions">
                <button className="confirm-cancel" onClick={() => setDeleteConfirm(null)}>Batal</button>
                <button className="confirm-delete" onClick={() => handleDelete(deleteConfirm)}>Ya, Hapus</button>
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit Modal */}
        {showModal && (
          <div className="um-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="um-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modalMode === 'add' ? 'Tambah User Baru' : 'Edit User'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                {formError && (
                  <div className="modal-error"><AlertCircle size={16} /> {formError}</div>
                )}
                <div className="modal-field">
                  <label>Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="email@contoh.com" />
                </div>
                <div className="modal-field">
                  <label>Password {modalMode === 'edit' && <span className="field-hint">(kosongkan jika tidak diubah)</span>}</label>
                  <input type="password" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} placeholder={modalMode === 'add' ? 'Masukkan password' : 'Password baru (opsional)'} />
                </div>
                <div className="modal-field">
                  <label>Role</label>
                  <select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="modal-cancel" onClick={() => setShowModal(false)}>Batal</button>
                  <button type="submit" className="modal-submit">
                    {modalMode === 'add' ? <><UserPlus size={16} /> Tambah User</> : <><Check size={16} /> Simpan Perubahan</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
