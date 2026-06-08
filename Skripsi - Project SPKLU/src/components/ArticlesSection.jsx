import React from 'react';
import { ArrowRight } from 'lucide-react';
import './ArticlesSection.css';

const articlesData = [
  {
    id: 1,
    image: '/images/artikel-1.jpg',
    title: 'Kenalan Sama Kendaraan Listrik, Apa Saja Untungnya?',
    category: 'Technology',
    date: 'April 22, 2026',
    link: 'https://www.roojai.co.id/article/kendaraan/ketahui-7-keuntungan-membeli-mobil-listrik/'
  },
  {
    id: 2,
    image: '/images/artikel-2.jpg',
    title: 'Merawat Baterai Mobil Listrik Agar Awet Bertahun-Tahun',
    category: 'Backend',
    date: 'April 20, 2026',
    link: 'https://wuling.id/id/blog/lifestyle/8-cara-merawat-baterai-mobil-listrik-agar-selalu-awet'
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
                <a 
                  href={article.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="article-link"
                >
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
