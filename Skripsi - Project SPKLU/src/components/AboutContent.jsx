import React from 'react';
import './AboutContent.css';

const AboutContent = () => {
  return (
    <div className="about-wrapper">
      <div className="container about-inner">
        
        {/* 1. Hero Section */}
        <section className="about-hero">
          <h1 className="about-title">Tentang Kami</h1>
          <p className="about-description">
            PT PETIRINDO JAYA ABADI berdiri tahun 2015 dan bergerak di bidang General Supplier & Contractor, Electrical, Maintenance Service. 
            Kami kuat dalam komitmen terhadap kualitas produk dan layanan kami 
            serta menjadikannya sebagai nilai utama dari perusahaan kami.
          </p>
          <a href="/contacts" className="btn-contact-us">Contact Us</a>
        </section>

        {/* 2. Mission & Vision Bento Grid */}
        <section className="about-bento-grid">
          <div className="bento-item bento-mission">
            <h3>Our Mission</h3>
            <p>
              Seiring kemajuan teknologi di Indonesia kami selalu mempertahankan kualitas untuk menjadi perusahaan yang
               komunikatif dengan konsumen guna memenuhi standar permintaan.
            </p>
          </div>
          
          <div className="bento-item bento-img bento-img-top">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" alt="Our Team" />
          </div>
          
          <div className="bento-item bento-img bento-img-bottom">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" alt="Our Office" />
          </div>
          
          <div className="bento-item bento-vision">
            <h3>Our Vision</h3>
            <p>
              Kami mendedikasikan keahlian kami untuk kepuasan konsumen yang terus menerus dalam pelayanan 24 jam 
              dengan tujuan memberikan manfaat yang sebesar-besarnya.
            </p>
          </div>
        </section>

        {/* 3. Klien Kami Section */}
        <section className="about-clients">
          <h2 className="clients-title">Klien kami</h2>
          <div className="clients-logo-container">
            <div className="client-logo">
              <img src="https://www.kindpng.com/picc/m/120-1207645_logo-pln-pln-indonesia-hd-png-download.png" alt="Logo PLN Mobile" />
            </div>
            <div className="client-logo">
              <img src="/logo-petirindo.png" alt="Logo PT Petirindo Jaya Abadi" />
            </div>
            <div className="client-logo">
              <img src="/images/klien/logo-nindya.png" alt="Logo PT Nindya Karya" />
            </div>
            <div className="client-logo">
              <img src="/images/klien/logo-klhk.png" alt="Logo Kementerian Lingkungan Hidup dan Kehutanan" />
            </div>
            {/* <div className="client-logo">
              <img src="/images/klien/logo-metland.png" alt="Logo PT Metropolitan Land Tbk (Metland)" />
            </div> */}
          </div>
        </section>

        {/* 4. Core Values Section */}
        <section className="about-values">
          <div className="values-header">
            <h2>Apa yang Bisa Kami Bantu?</h2>
            <p>Sekarang saatnya ambil peran di dunia kendaraan listrik. 
              Kami mengajak kamu untuk berkolaborasi menyediakan jaringan SPKLU di seluruh pelosok negeri. 
              Usaha jalan terus, lingkungan pun tetap terjaga.</p>
          </div>
          
          <div className="values-container">
            <div className="value-column">
              <h4>Partnership</h4>
              <p>Mau punya aset masa depan? Yuk, jadi mitra kami dalam penyediaan infrastruktur pengisian daya. 
                Kita bangun jaringan SPKLU yang luas di seluruh Indonesia bersama-sama.</p>
            </div>
            <div className="value-column border-left">
              <h4>Pemasangan SPKLU</h4>
              <p>Butuh tempat ngecas pribadi atau untuk fasilitas umum? Kami siap bantu pasang perangkat SPKLU di rumah, kantor, mal, hingga hotel supaya akses daya jadi lebih dekat.</p>
            </div>
            <div className="value-column border-left">
              <h4>Collaboration</h4>
              <p>Bawa bisnis Anda selangkah lebih maju. Kami membuka ruang kolaborasi bagi pengembang properti, pengelola kawasan, hingga instansi untuk 
                bersinergi mewujudkan ekosistem kendaraan listrik yang terintegrasi dan saling menguntungkan.</p>
            </div>
            <div className="value-column border-left">
              <h4>Trust</h4>
              <p>Keamanan dan kenyamanan Anda adalah prioritas utama. Dengan perangkat SPKLU berstandar tinggi dan sistem pengelolaan yang transparan
                , kami berkomitmen memberikan layanan yang dapat diandalkan oleh mitra maupun pengguna.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutContent;
