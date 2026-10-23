import React from 'react';

export default function ComingSoon({ onAdminClick }) {
  return (
    <div className="fullscreen-inauguration-wrapper">
      {/* Blurred atmospheric backdrop to blend seamlessly on mobile portrait & desktop */}
      <div 
        className="fullscreen-backdrop-blur"
        style={{ backgroundImage: `url('/comingsoon.jpeg')` }}
      />

      {/* Main Full-Size Image Container */}
      <div className="fullscreen-img-stage">
        <img 
          src="/comingsoon.jpeg" 
          alt="Nellaya Gramapanchayat Keralolsavam 2026" 
          className="fullscreen-inauguration-img mode-contain"
        />
      </div>

      {/* Invisible secret admin entrance at top right (Double-tap / double-click to access admin when needed) */}
      <div 
        onClick={onAdminClick}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '60px',
          height: '60px',
          zIndex: 999999,
          cursor: 'default',
          opacity: 0
        }}
        title="Admin"
      />
    </div>
  );
}
