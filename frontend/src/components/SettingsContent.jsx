import React from 'react';
import { Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './SettingsContent.css';

const SettingsContent = () => {
  const { isDarkMode, toggleDarkMode } = useAuth();

  return (
    <section className="settings">
      <div className="settings-card">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-subtitle">Kelola preferensi aplikasi Anda</p>

        <div className="settings-group">
          {/* Dark Mode Toggle */}
          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-icon">
                <Moon size={20} />
              </div>
              <div className="settings-row-text">
                <h4>Dark Mode</h4>
                <p>Aktifkan tampilan gelap untuk kenyamanan mata</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsContent;
