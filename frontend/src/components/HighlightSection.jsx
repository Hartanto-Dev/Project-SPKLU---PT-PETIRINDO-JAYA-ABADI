import React from 'react';
import './HighlightSection.css';

const highlightsData = [
  {
    title: 'Pengguna Puas',
    value: '100%',
    description: 'Komitmen kami adalah memberikan layanan pengisian daya terbaik tanpa kendala untuk kenyamanan perjalanan kamu.'
  },
  {
    title: 'Titik SPKLU',
    value: '10+',
    description: 'Jaringan kami terus bertumbuh dan tersebar di berbagai lokasi favoritmu agar ngecas jadi makin mudah.'
  },
  {
    title: 'Siap Membantu',
    value: '24/7',
    description: 'Tim bantuan kami selalu stand by kapan pun kamu butuh kendala teknis atau informasi seputar pengisian daya.'
  }
];

const HighlightSection = () => {
  return (
    <section className="section-padding highlight-section">
      <div className="container">
        <div className="highlight-grid">
          {highlightsData.map((item, index) => (
            <div key={index} className="highlight-card">
              <h3 className="highlight-value">{item.value}</h3>
              <h4 className="highlight-title">{item.title}</h4>
              <p className="highlight-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightSection;
