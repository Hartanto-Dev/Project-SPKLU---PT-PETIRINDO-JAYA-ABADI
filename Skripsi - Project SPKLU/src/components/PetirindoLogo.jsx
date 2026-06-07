import React from 'react';

const PetirindoLogo = ({ size = 36 }) => (
  <img 
    src="/logo-petirindo.png" 
    alt="Logo PT Petirindo Jaya Abadi" 
    style={{ width: size, height: size, objectFit: 'contain', display: 'block', flexShrink: 0 }} 
  />
);

export default PetirindoLogo;

