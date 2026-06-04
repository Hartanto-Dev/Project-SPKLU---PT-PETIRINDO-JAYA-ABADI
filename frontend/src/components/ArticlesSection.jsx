import React from 'react';
import { ArrowRight } from 'lucide-react';
import './ArticlesSection.css';

const articlesData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
    title: 'Kenalan Sama Kendaraan Listrik, Apa Saja Untungnya?',
    category: 'Technology',
    date: 'April 22, 2026'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    title: 'Merawat Baterai Mobil Listrik Agar Awet Bertahun-Tahun',
    category: 'Backend',
    date: 'April 20, 2026'
  }
];

const ArticlesSection = () => {
  return (
    <section className="section-padding articles-section" id="articles">
      <div className="container">
        <h2 className="heading-lg text-center">Cek Info Terbaru atau Seputar Listrik</h2>
        
        <div className="articles-grid">
          {articlesData.map((article) => (
            <article key={article.id} className="article-card">
              <div className="article-image-container">
                <img src={article.image} alt={article.title} className="article-image" />
              </div>
              <div className="article-content">
                <span className="article-date">{article.date}</span>
                <h3 className="article-title">{article.title}</h3>
                <a href="#" className="article-link">
                  Read More <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
