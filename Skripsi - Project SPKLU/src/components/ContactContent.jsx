import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Phone, MapPin, Mail, Globe, MessageCircle, Share2, ArrowRight, CheckCircle, XCircle, Loader } from 'lucide-react';
import './ContactContent.css';

// ============================================================
// EMAILJS CONFIGURATION
// Ganti nilai di bawah ini setelah setup di emailjs.com
// ============================================================
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // contoh: 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // contoh: 'template_xyz456'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // contoh: 'aBcDeFgHiJkLmNoP'
// ============================================================

const ContactContent = () => {
  const formRef = useRef();

  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  formData.from_name,
          from_email: formData.from_email,
          subject:    formData.subject,
          message:    formData.message,
          to_email:   'hartanto.projectdgm20@gmail.com',
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus('success');
      setFormData({ from_name: '', from_email: '', subject: '', message: '' });

      // Kembali ke idle setelah 5 detik
      setTimeout(() => setStatus('idle'), 5000);

    } catch (err) {
      console.error('EmailJS error:', err);
      setErrorMessage('Gagal mengirim pesan. Silakan coba lagi atau hubungi kami langsung.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="container contact-inner">

        {/* 2. Main Content: Info & Form Section */}
        <section className="contact-main-grid">

          {/* Left Column: Contact Info */}
          <div className="contact-info">
            <span className="info-label"></span>
            <h2 className="info-title">We are always ready to help you and answer your questions</h2>
            <p className="info-description">
              Have questions about our charging stations, partnerships, or just want to say hello?
              Fill out the form or reach out via our contact details below. Our team is here to assist you.
            </p>

            <div className="info-details-grid">
              <div className="detail-item">
                <div className="detail-icon"><Phone size={20} /></div>
                <div className="detail-text">
                  <h4>Call Center</h4>
                  <p>+62 812 1574 4542</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon"><MapPin size={20} /></div>
                <div className="detail-text">
                  <h4>Our Location</h4>
                  <p>Jl. Kaput No.8, RT.007/RW.011, Jatimakmur, Kec. Pd. Gede, Kota Bks, Jawa Barat 17413</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon"><Mail size={20} /></div>
                <div className="detail-text">
                  <h4>Email</h4>
                  <p>cs@petir-indonesia.co.id</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon"><Globe size={20} /></div>
                <div className="detail-text">
                  <h4>Social network</h4>
                  <div className="social-links">
                    <a href="#"><Globe size={18} /></a>
                    <a href="#"><MessageCircle size={18} /></a>
                    <a href="#"><Share2 size={18} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-card">
            <h3>Get in Touch</h3>
            <p>Fill out the form below and we'll get back to you shortly.</p>

            {/* Status Notifications */}
            {status === 'success' && (
              <div className="form-notification form-notification--success">
                <CheckCircle size={20} />
                <span>Pesan berhasil dikirim! Kami akan segera menghubungi Anda.</span>
              </div>
            )}
            {status === 'error' && (
              <div className="form-notification form-notification--error">
                <XCircle size={20} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="from_name"
                  placeholder="Full name"
                  value={formData.from_name}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  name="from_email"
                  placeholder="Email address"
                  value={formData.from_email}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                />
              </div>
              <div className="input-group">
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                />
              </div>
              <button
                type="submit"
                className={`btn-submit ${status === 'loading' ? 'btn-submit--loading' : ''}`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader size={18} className="spin-icon" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    Send a message <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

        </section>

        {/* 3. Map Section */}
        <section className="contact-map">
          <div className="map-placeholder">
            <iframe
              src="https://maps.google.com/maps?q=PT+PETIRINDO+JAYA+ABADI,+Jl.+Kaput+No.8,+Jatimakmur,+Bekasi&z=17&output=embed"
              className="map-iframe"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi PT Petirindo Jaya Abadi - Jl. Kaput No.8, Jatimakmur, Bekasi"
            ></iframe>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ContactContent;
