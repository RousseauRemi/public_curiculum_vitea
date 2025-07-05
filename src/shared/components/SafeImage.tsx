import React, { useState, useRef, memo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  showFallbackIcon?: boolean;
  onError?: () => void;
  onLoad?: () => void;
  placeholder?: React.ReactNode;
  lazy?: boolean;
  style?: React.CSSProperties;
  sizes?: string;
  srcSet?: string;
  webpSrc?: string;
  avifSrc?: string;
  aspectRatio?: string;
}

const SafeImage: React.FC<SafeImageProps> = memo(({
  src,
  alt,
  className = '',
  fallbackSrc,
  showFallbackIcon = true,
  onError,
  onLoad,
  placeholder,
  lazy = true,
  style,
  sizes,
  srcSet,
  webpSrc,
  avifSrc,
  aspectRatio
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isIntersecting, setIsIntersecting] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    
    if (currentSrc === src && fallbackSrc) {
      // Try fallback image first
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    // If fallback also fails or no fallback provided
    setHasError(true);
    onError?.();
  }, [currentSrc, src, fallbackSrc, onError]);

  const renderFallback = () => {
    if (!showFallbackIcon) return null;
    
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`} 
        style={{ ...style, aspectRatio }}
      >
        <ImageIcon className="text-gray-400" size={24} />
      </div>
    );
  };

  const renderPlaceholder = () => {
    if (placeholder) return placeholder;
    
    return (
      <div 
        className={`animate-pulse bg-gray-200 ${className}`} 
        style={{ ...style, aspectRatio }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  };

  if (hasError) {
    return renderFallback();
  }

  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{ aspectRatio }}
    >
      {isLoading && renderPlaceholder()}
      
      {isIntersecting && (
        <>
          {(webpSrc || avifSrc) ? (
            <picture>
              {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
              {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
              <motion.img
                ref={imgRef}
                src={currentSrc}
                alt={alt}
                className={`${className} ${isLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'}`}
                style={style}
                onLoad={handleLoad}
                onError={handleError}
                loading={lazy ? 'lazy' : 'eager'}
                sizes={sizes}
                srcSet={srcSet}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />
            </picture>
          ) : (
            <motion.img
              ref={imgRef}
              src={currentSrc}
              alt={alt}
              className={`${className} ${isLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'}`}
              style={style}
              onLoad={handleLoad}
              onError={handleError}
              loading={lazy ? 'lazy' : 'eager'}
              sizes={sizes}
              srcSet={srcSet}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </>
      )}
    </div>
  );
});

SafeImage.displayName = 'SafeImage';

export default SafeImage;