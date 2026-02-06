import { useState, useRef } from 'react';

export default function HoverLink({ href, children, previewImage, external = true }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const linkRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (e) => {
    // Use viewport coordinates for fixed positioning
    setMousePos({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <span 
      className="hover-link-container"
      ref={linkRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <a 
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="hover-link"
      >
        {children}
      </a>
      
      {previewImage && isHovered && (
        <div 
          className="hover-preview"
          style={{
            left: `${mousePos.x + 20}px`,
            top: `${mousePos.y - 100}px`,
          }}
        >
          <img 
            src={previewImage} 
            alt="" 
            loading="lazy"
          />
        </div>
      )}
    </span>
  );
}
