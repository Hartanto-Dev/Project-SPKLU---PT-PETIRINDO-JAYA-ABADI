import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PetirindoLogo from './PetirindoLogo';
import './RegisterContent.css';

const RegisterContent = () => {
  const navigate = useNavigate();
  const { addUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '', confirmPassword: '' };
    let isValid = true;
    if (!email.trim()) { newErrors.email = 'Email wajib diisi'; isValid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { newErrors.email = 'Format email tidak valid'; isValid = false; }
    if (!password.trim()) { newErrors.password = 'Password wajib diisi'; isValid = false; }
    else if (password.length < 6) { newErrors.password = 'Password minimal 6 karakter'; isValid = false; }
    if (!confirmPassword.trim()) { newErrors.confirmPassword = 'Konfirmasi password wajib diisi'; isValid = false; }
    else if (password !== confirmPassword) { newErrors.confirmPassword = 'Password tidak cocok'; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setStatusMessage('');
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    const result = addUser(email, password, 'User');

    if (result.success) {
      setStatus('success');
      setStatusMessage('Pendaftaran berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setStatus('error');
      setStatusMessage(result.message || 'Pendaftaran gagal. Silakan coba lagi.');
    }

    setIsLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-bg">
        <div className="register-bg-orb register-bg-orb-1"></div>
        <div className="register-bg-orb register-bg-orb-2"></div>
        <div className="register-bg-orb register-bg-orb-3"></div>
        <div className="register-bg-grid"></div>
      </div>

      <div className="register-container">
        <div className="register-branding">
          <div className="branding-content">
            <div className="branding-logo">
              <PetirindoLogo />
              <span>PETIRINDO SPKLU</span>
            </div>
            <h1 className="branding-headline">
              Bergabunglah<br />
              Bersama <span className="text-gradient">Kami</span>
            </h1>
            <p className="branding-desc">
              Daftarkan akun Anda untuk mengakses informasi lengkap mengenai lokasi SPKLU di seluruh Indonesia.
            </p>
            <div className="branding-stats">
              <div className="branding-stat"><Zap size={20} /><div><strong>1,518</strong><span>Stasiun SPKLU</span></div></div>
              <div className="branding-stat"><Zap size={20} /><div><strong>34</strong><span>Provinsi</span></div></div>
              <div className="branding-stat"><Zap size={20} /><div><strong>24/7</strong><span>Akses</span></div></div>
            </div>
          </div>
        </div>

        <div className="register-form-panel">
          <div className="register-form-wrapper">
            <div className="form-header">
              <h2>Buat Akun Baru</h2>
              <p>Isi data di bawah untuk mendaftar</p>
            </div>

            {status && (
              <div className={`register-alert ${status === 'success' ? 'alert-success' : 'alert-error'}`}>
                {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form" noValidate>
              <div className={`form-field ${errors.email ? 'field-error' : ''}`}>
                <label htmlFor="register-email"><Mail size={16} /> Email</label>
                <div className="input-wrapper">
                  <input id="register-email" type="email" placeholder="contoh@email.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); setStatus(null); }}
                    autoComplete="email" disabled={isLoading} />
                </div>
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>

              <div className={`form-field ${errors.password ? 'field-error' : ''}`}>
                <label htmlFor="register-password"><Lock size={16} /> Password</label>
                <div className="input-wrapper">
                  <input id="register-password" type={showPassword ? 'text' : 'password'} placeholder="Minimal 6 karakter" value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); setStatus(null); }}
                    autoComplete="new-password" disabled={isLoading} />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="field-error-text">{errors.password}</span>}
              </div>

              <div className={`form-field ${errors.confirmPassword ? 'field-error' : ''}`}>
                <label htmlFor="register-confirm-password"><Lock size={16} /> Konfirmasi Password</label>
                <div className="input-wrapper">
                  <input id="register-confirm-password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Ulangi password" value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })); setStatus(null); }}
                    autoComplete="new-password" disabled={isLoading} />
                  <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="field-error-text">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className={`register-submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading} id="register-button">
                {isLoading ? (<><span className="spinner"></span>Memproses...</>) : (<><UserPlus size={18} />Daftar</>)}
              </button>
            </form>

            <div className="form-divider"><span>atau</span></div>
            <p className="form-footer-text">Sudah punya akun? <Link to="/login" className="login-link">Masuk Sekarang</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterContent;
