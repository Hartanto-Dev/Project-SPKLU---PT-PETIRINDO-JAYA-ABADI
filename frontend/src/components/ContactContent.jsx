import React from 'react';
import { Phone, MapPin, Mail, Globe, MessageCircle, Share2, ArrowRight, Star } from 'lucide-react';
import './ContactContent.css';

const ContactContent = () => {
  return (
    <div className="contact-wrapper">
      <div className="container contact-inner">

        {/* 1. Hero Banner Section
        <section className="contact-hero">
          <div className="contact-hero-content">
            <h1 className="hero-title">Contacts</h1>
            <h1 className="hero-title-outline">Contacts</h1>
          </div>
          <div className="hero-breadcrumb">
            <span className="breadcrumb-text">Home / Contacts</span>
          </div>
        </section> */}

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
                  <p>+62 812 3456 7890</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon"><MapPin size={20} /></div>
                <div className="detail-text">
                  <h4>Our Location</h4>
                  <p>Jl. Kaput No.11, Jatimakmur, Bekasi</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon"><Mail size={20} /></div>
                <div className="detail-text">
                  <h4>Email</h4>
                  <p>hello@poseidon.id</p>
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

            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <input type="text" placeholder="Full name" required />
              </div>
              <div className="input-group">
                <input type="email" placeholder="Email address" required />
              </div>
              <div className="input-group">
                <input type="text" placeholder="Subject" required />
              </div>
              <div className="input-group">
                <textarea placeholder="Message" rows="4" required></textarea>
              </div>
              <button type="submit" className="btn-submit">
                Send a message <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </section>

        {/* 3. Map Section */}
        <section className="contact-map">
          <div className="map-placeholder">
            <iframe
              src="https://www.google.com/maps?q=Jl.+Kaput+No.8,+RT.007/RW.011,+Jatimakmur,+Kec.+Pd.+Gede,+Kota+Bks,+Jawa+Barat+17413&output=embed"
              className="map-iframe"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            ></iframe>
            {/* Floating Info Window */}
            {/* <div className="map-info-window">
              <h4 className="window-title">PT PETIRINDO JAYA ABADI</h4>
              <div className="window-rating">
                <span>4.9</span>
                <div className="stars">
                  <Star size={14} fill="#FFB800" stroke="none" />
                  <Star size={14} fill="#FFB800" stroke="none" />
                  <Star size={14} fill="#FFB800" stroke="none" />
                  <Star size={14} fill="#FFB800" stroke="none" />
                  <Star size={14} fill="#FFB800" stroke="none" />
                </div>
                <span className="review-count">(128 reviews)</span>
              </div>
              <p className="window-address">Jl. Kaput No.8, RT.007/RW.011, Jatimakmur, Kec. Pd. Gede, Kota Bks, Jawa Barat 17413</p>
              <a href="https://www.google.com/maps?q=Jl.+Kaput+No.8,+RT.007/RW.011,+Jatimakmur,+Kec.+Pd.+Gede,+Kota+Bks,+Jawa+Barat+17413" target="_blank" rel="noopener noreferrer" className="window-link">View larger map</a>
            </div> */}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ContactContent;
