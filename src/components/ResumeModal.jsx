import React from 'react';

export default function ResumeModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      id="resumeModal"
      className="modal"
      style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000 }}
      onClick={(e) => {
        if (e.target.id === 'resumeModal') onClose();
      }}
    >
      <div className="modal-content" style={{ maxWidth: 800, margin: '10% auto', backgroundColor: 'white', padding: 20, borderRadius: 5 }}>
        <span className="close" style={{ color: 'black', float: 'right', fontSize: 28, fontWeight: 'bold', cursor: 'pointer' }} onClick={onClose}>
          &times;
        </span>
        <object data="/Shivom_Sharma_Resume.pdf" type="application/pdf" width="100%" height="100%" style={{ border: 'none', minHeight: 600 }}></object>
      </div>
    </div>
  );
}


