import React from 'react';
import './DashboardSection.css';

const DashboardSection = () => {
  return (
    <section className="section-padding dashboard-section" id="dashboard">
      <div className="container">
        <div className="dashboard-placeholder card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--surface)' }}>
          <h2 className="heading-lg">Dashboard</h2>
          <p className="text-lead">Fitur Peta dan Diagram Garis telah dihilangkan.</p>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
