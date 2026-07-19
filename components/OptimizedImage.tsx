import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
}

/**
 * Optimized Image Component with:
 * - Lazy loading
 * - Blur-up placeholder effect
 * - WebP format support detection
 * - Error handling
 * - Performance tracking
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  placeholder,
  onLoad,
  onError,
  sizes,
  srcSet,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [webpSupported, setWebpSupported] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  // Check WebP support
  useEffect(() => {
    const checkWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      setWebpSupported(supported);
    };
    checkWebP();
  }, []);

  // Generate WebP src if original is not WebP
  const getOptimizedSrc = (originalSrc: string): string => {
    if (!webpSupported || originalSrc.includes('.webp')) {
      return originalSrc;
    }
    // For external images, try to add ?fm=webp or .webp extension
    if (originalSrc.includes('unsplash.com')) {
      return `${originalSrc}${originalSrc.includes('?') ? '&' : '?'}fm=webp&q=80`;
    }
    if (originalSrc.includes('images.unsplash.com')) {
      return `${originalSrc}${originalSrc.includes('?') ? '&' : '?'}fm=webp&q=80`;
    }
    return originalSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
    
    // Performance tracking
    if (imageRef.current) {
      const perfData = {
        src: imageRef.current.src,
        loadTime: performance.now(),
      };
      if (import.meta.env.DEV) {
        console.log('Image loaded:', perfData);
      }
    }
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
    console.error(`Failed to load image: ${src}`);
  };

  // Generate blur placeholder
  const generateBlurDataUrl = (color: string = '#1a1a1a'): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 10, 10);
    }
    return canvas.toDataURL();
  };

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-zinc-800 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-zinc-500">
          <svg 
            className="w-8 h-8 mx-auto mb-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-xs">Image unavailable</p>
        </div>
      </div>
    );
  }

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-zinc-800 animate-pulse"
          style={{
            backgroundImage: `url(${generateBlurDataUrl()})`,
            backgroundSize: 'cover',
          }}
        >
          {placeholder}
        </div>
      )}

      {/* Actual Image */}
      <img
        ref={imageRef}
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        decoding="async"
      />
    </div>
  );
};

// ============================================
// Image Preloading Utilities
// ============================================

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

// ============================================
// Responsive Image Component
// ============================================

interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
}) => {
  // Generate srcset for different sizes
  const generateSrcSet = (baseSrc: string): string => {
    if (baseSrc.includes('unsplash.com')) {
      return `
        ${baseSrc}&w=320 320w,
        ${baseSrc}&w=640 640w,
        ${baseSrc}&w=1024 1024w,
        ${baseSrc}&w=1920 1920w
      `.trim().replace(/\s+/g, ' ');
    }
    return baseSrc;
  };

  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio }}>
      <OptimizedImage
        src={src}
        alt={alt}
        srcSet={generateSrcSet(src)}
        sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
        className="w-full h-full"
      />
    </div>
  );
};

export default OptimizedImage;