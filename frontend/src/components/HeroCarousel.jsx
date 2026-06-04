import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroCarousel.css';

const slides = [
  {
    id: 1,
    image: '/images/carousel/slide-1.png',
    title: 'PETIRINDO SPKLU',
    subtitle: 'Solusi Pengisian Kendaraan Listrik Terdepan di Indonesia'
  },
  {
    id: 2,
    image: '/images/carousel/slide-2.png',
    title: 'Jaringan Charging Terluas',
    subtitle: '1.500+ Stasiun Pengisian Tersebar di 34 Provinsi'
  },
  {
    id: 3,
    image: '/images/carousel/slide-3.png',
    title: 'Masa Depan Mobilitas Hijau',
    subtitle: 'Fast Charging & Ultra Fast Charging untuk Perjalanan Tanpa Batas'
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(1);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-carousel">
      <div 
        className="carousel-inner"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="carousel-slide">
            <div className="slide-image-container">
              <img src={slide.image} alt={slide.title} className="slide-image" />
              <div className="slide-overlay"></div>
            </div>
            <div className="slide-content container">
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-control prev" onClick={prevSlide}>
        <ChevronLeft size={32} />
      </button>
      <button className="carousel-control next" onClick={nextSlide}>
        <ChevronRight size={32} />
      </button>

      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
