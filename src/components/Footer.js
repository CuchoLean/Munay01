import React from 'react';

const Footer = () => {
  return (
    <footer className="p-2"
      style={{
        background: 'linear-gradient(90deg, #3a0ca3 0%, #240046 100%)', // morado oscuro intenso
        color: '#dcd6f7', // blanco lavanda suave para contraste
        textAlign: 'center',
        boxShadow: '0 -2px 10px rgba(36, 0, 70, 0.7)', // sombra morada oscura
        letterSpacing: '0.05em',
        userSelect: 'none',
      }}
    >
      © 2025 <strong>TFG Leandro Cucho Noriega</strong>
    </footer>
  );
};

export default Footer;
