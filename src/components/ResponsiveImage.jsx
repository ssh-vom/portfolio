import React, { useState, useRef, useEffect } from 'react';

export default function ResponsiveImage({ src, alt, width, className = '', style = {}, ...props }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    // Generate responsive image sources
    const generateSrcSet = (baseSrc) => {
        // Vite image optimizer will handle this automatically
        // For now, we'll use the base image
        return baseSrc;
    };

    const imageWidth = width || style.width || '100%';

    return (
        <div
            ref={imgRef}
            className={`responsive-image-container ${className}`}
            style={{
                position: 'relative',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                width: typeof imageWidth === 'number' ? imageWidth + 'px' : imageWidth,
                maxWidth: '100%',
                ...style
            }}
            {...props}
        >
            {isInView && (
                <img
                    src={src}
                    srcSet={generateSrcSet(src)}
                    alt={alt}
                    onLoad={handleLoad}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                        border: '1px solid #3d4450',
                        borderRadius: '4px',
                    }}
                    loading="lazy"
                />
            )}

            {/* Loading placeholder */}
            {!isLoaded && isInView && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, #2a475e 25%, #3d4450 50%, #2a475e 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'loading 1.5s infinite',
                        borderRadius: '4px',
                    }}
                />
            )}

            <style>{`
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}