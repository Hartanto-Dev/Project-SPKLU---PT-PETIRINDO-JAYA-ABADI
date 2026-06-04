import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import Features from '../components/Features';
import ChargingStationMap from '../components/ChargingStationMap';
import ArticlesSection from '../components/ArticlesSection';
import HighlightSection from '../components/HighlightSection';

const Home = () => {
  return (
    <main>
      <HeroCarousel />
      <Features />
      <ChargingStationMap />
      <ArticlesSection />
      <HighlightSection />
    </main>
  );
};

export default Home;
