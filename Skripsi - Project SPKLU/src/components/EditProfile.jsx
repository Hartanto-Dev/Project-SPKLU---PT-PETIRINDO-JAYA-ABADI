import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './EditProfile.css';

const EditProfile = () => {
  const { currentUser, profileName, profilePhoto, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(profileName || '');
  const [photoPreview, setPhotoPreview] = useState(profilePhoto || null);
  const [photoFile, setPhotoFile] = useState(null);
  const [saved, setSaved] = useState(false);

  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setPhotoFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const photo = photoFile !== null ? photoFile : profilePhoto;
    updateProfile(name, photo);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <section className="edit-profile">
      <div className="edit-profile-card">
        <h2 className="edit-profile-title">Edit Profile</h2>

        {/* Avatar Upload */}
        <div className="edit-profile-avatar-section">
          <div className="edit-profile-avatar-wrapper" onClick={handleAvatarClick}>
            <div className="edit-profile-avatar-circle">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" />
              ) : (
                getInitials(currentUser?.email)
              )}
            </div>
            <div className="edit-profile-avatar-overlay">
              <Camera size={24} />
            </div>
          </div>
          <span className="edit-profile-avatar-hint">Klik untuk mengubah foto</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="edit-profile-file-input"
            onChange={handleFileChange}
          />
        </div>

        {/* Form */}
        <form className="edit-profile-form" onSubmit={handleSave}>
          <div className="edit-profile-field">
            <label className="edit-profile-label">Nama</label>
            <input
              type="text"
              className="edit-profile-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
            />
          </div>

          <div className="edit-profile-field">
            <label className="edit-profile-label">Email</label>
            <input
              type="email"
              className="edit-profile-input"
              value={currentUser?.email || ''}
              readOnly
            />
          </div>

          {saved && (
            <div className="edit-profile-success">
              ✓ Profil berhasil diperbarui!
            </div>
          )}

          <div className="edit-profile-actions">
            <button type="button" className="edit-profile-btn edit-profile-btn-cancel" onClick={handleCancel}>
              Batal
            </button>
            <button type="submit" className="edit-profile-btn edit-profile-btn-save">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditProfile;
