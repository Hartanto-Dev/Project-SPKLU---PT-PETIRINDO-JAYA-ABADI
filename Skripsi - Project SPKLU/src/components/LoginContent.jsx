import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PetirindoLogo from './PetirindoLogo';
import './LoginContent.css';

const LoginContent = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;
    if (!email.trim()) { newErrors.email = 'Email wajib diisi'; isValid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { newErrors.email = 'Format email tidak valid'; isValid = false; }
    if (!password.trim()) { newErrors.password = 'Password wajib diisi'; isValid = false; }
    else if (password.length < 6) { newErrors.password = 'Password minimal 6 karakter'; isValid = false; }
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

    const result = login(email, password);

    if (result.success) {
      setStatus('success');
      const isAdmin = result.role === 'Admin';
      setStatusMessage(isAdmin
        ? 'Login Admin Berhasil! Mengalihkan ke Dashboard...'
        : 'Login Berhasil! Mengalihkan ke halaman utama...');
      setTimeout(() => {
        navigate(isAdmin ? '/admin/dashboard' : '/');
      }, 1500);
    } else {
      setStatus('error');
      setStatusMessage('Email atau password salah. Silakan coba lagi.');
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb-1"></div>
        <div className="login-bg-orb login-bg-orb-2"></div>
        <div className="login-bg-orb login-bg-orb-3"></div>
        <div className="login-bg-grid"></div>
      </div>

      <div className="login-container">
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-logo">
              <PetirindoLogo />
              <span>PETIRINDO SPKLU</span>
            </div>
            <h1 className="branding-headline">
              Temukan Stasiun<br />
              Pengisian <span className="text-gradient">Terdekat</span>
            </h1>
            <p className="branding-desc">
              Akses 1.500+ lokasi SPKLU di seluruh Indonesia. Cari, filter, dan navigasi langsung ke stasiun pengisian kendaraan listrik pilihan Anda.
            </p>
            <div className="branding-stats">
              <div className="branding-stat"><Zap size={20} /><div><strong>1,518</strong><span>Stasiun SPKLU</span></div></div>
              <div className="branding-stat"><Zap size={20} /><div><strong>34</strong><span>Provinsi</span></div></div>
              <div className="branding-stat"><Zap size={20} /><div><strong>24/7</strong><span>Akses</span></div></div>
            </div>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="form-header">
              <h2>Masuk ke Akun Anda</h2>
              <p>Silakan masukkan kredensial untuk melanjutkan</p>
            </div>

            {status && (
              <div className={`login-alert ${status === 'success' ? 'alert-success' : 'alert-error'}`}>
                {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className={`form-field ${errors.email ? 'field-error' : ''}`}>
                <label htmlFor="login-email"><Mail size={16} /> Email</label>
                <div className="input-wrapper">
                  <input id="login-email" type="email" placeholder="contoh@email.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); setStatus(null); }}
                    autoComplete="email" disabled={isLoading} />
                </div>
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>

              <div className={`form-field ${errors.password ? 'field-error' : ''}`}>
                <label htmlFor="login-password"><Lock size={16} /> Password</label>
                <div className="input-wrapper">
                  <input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); setStatus(null); }}
                    autoComplete="current-password" disabled={isLoading} />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="field-error-text">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-label" htmlFor="remember-me">
                  <input id="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={isLoading} />
                  <span className="checkbox-custom"></span>
                  Ingat Saya
                </label>
                <Link to="#" className="forgot-link">Lupa Password?</Link>
              </div>

              <button type="submit" className={`login-submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading} id="login-button">
                {isLoading ? (<><span className="spinner"></span>Memproses...</>) : (<><LogIn size={18} />Masuk</>)}
              </button>
            </form>

            <div className="form-divider"><span>atau</span></div>
            <p className="form-footer-text">Belum punya akun? <Link to="#" className="signup-link">Daftar Sekarang</Link></p>

            <div className="demo-hint">
              <strong>User:</strong> user12345@gmail.com / user12345<br />
              <strong>Admin:</strong> admin12345@gmail.com / admin12345
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginContent;
