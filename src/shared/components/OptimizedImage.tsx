import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMyMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgOTZMMTI4IDExMkwxNTIgMTM2TDE3NiAxMTJMMTkyIDEyOEwyMDggMTA0VjEyOEgxMTJWMTA0TDE0NCA5NloiIGZpbGw9IiM5Q0E5QjciLz4KPC9zdmc+',
  onLoad,
  onError,
  lazy = true
}) => {
  // Disable lazy loading for PDF generation contexts or when explicitly disabled
  const isPDFContext = document.body.classList.contains('generating-pdf') || 
                       className.includes('generating-pdf') || 
                       className.includes('project-image');
  const shouldUseLazy = lazy && !isPDFContext;
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [isInView, setIsInView] = useState(!shouldUseLazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(shouldUseLazy ? placeholder : src);

  useEffect(() => {
    if (!shouldUseLazy) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [shouldUseLazy]);

  useEffect(() => {
    if (isInView && currentSrc !== src) {
      setCurrentSrc(src);
    }
  }, [isInView, src, currentSrc]);

  const handleLoad = () => {
    setImageState('loaded');
    onLoad?.();
  };

  const handleError = () => {
    setImageState('error');
    setCurrentSrc(placeholder);
    onError?.();
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageState === 'loaded' ? 'opacity-100' : 'opacity-70'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={shouldUseLazy ? 'lazy' : 'eager'}
      />
      
      {imageState === 'loading' && isInView && (
        <div className="absolute inset-0 bg-secondary-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {imageState === 'error' && (
        <div className="absolute inset-0 bg-secondary-100 flex items-center justify-center">
          <div className="text-center text-secondary-600">
            <svg
              className="w-8 h-8 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Image failed to load</span>
          </div>
        </div>
      )}
    </div>
  );
};