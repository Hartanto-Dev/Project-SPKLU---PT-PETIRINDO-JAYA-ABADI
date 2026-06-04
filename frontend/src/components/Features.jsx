import React from 'react';
import { Target, Zap, Shield } from 'lucide-react';
import './Features.css';

const featuresData = [
  {
    icon: <Target className="feature-icon" />,
    title: 'Lokasi Strategis',
    description: 'Temukan titik pengisian daya terdekat dengan mudah melalui integrasi peta yang akurat. Kami hadir di pusat kota, pusat perbelanjaan, dan rest area untuk mendukung perjalanan Anda.'
  },
  {
    icon: <Zap className="feature-icon" />,
    title: 'Pengisian Cepat',
    description: 'Hemat waktu Anda dengan teknologi Fast Charging dan Ultra Fast Charging. Isi daya kendaraan listrik Anda hingga 80% dalam waktu singkat agar Anda bisa segera kembali beraktivitas.'
  },
  {
    icon: <Shield className="feature-icon" />,
    title: 'Keamanan Terjamin',
    description: 'proteksi kelistrikan tingkat tinggi dan pembayaran digital yang aman. Proses pengisian daya dipantau secara otomatis untuk menjaga kesehatan baterai kendaraan Anda.'
  }
];

const Features = () => {
  return (
    <section className="section-padding features-section" id="about">
      <div className="container">
        <div className="features-header">
          <h2 className="heading-lg">Bersama Menuju Mobilitas Tanpa Emisi</h2>
          <p className="text-lead">
            Bergabunglah dalam revolusi transportasi hijau. Kami berkomitmen menyediakan akses energi bersih yang mudah dijangkau bagi 
            setiap pemilik kendaraan listrik di Indonesia. 
            Mari ciptakan udara yang lebih bersih dan lingkungan 
            yang lebih sehat untuk generasi mendatang melalui setiap pengisian 
            daya.
          </p>
        </div>

        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
