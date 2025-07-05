import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import useAppStore from '../../store/useAppStore';

interface TranslationWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const TranslationWrapper: React.FC<TranslationWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  const { language } = useAppStore();
  const { isLoading, isLoaded, error } = useTranslation(language);

  if (error) {
    return (
      <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg">
        Translation error: {error}
      </div>
    );
  }

  if (isLoading || !isLoaded) {
    return (
      <div className="animate-pulse">
        {fallback || (
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

interface TranslationTextProps {
  translationKey: string;
  fallback?: string;
  className?: string;
}

export const TranslationText: React.FC<TranslationTextProps> = ({ 
  translationKey, 
  fallback, 
  className = '' 
}) => {
  const { language } = useAppStore();
  const { t, isLoading, isLoaded } = useTranslation(language);

  if (isLoading || !isLoaded) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded h-4 ${className}`}>
        {fallback && (
          <span className="opacity-0">{fallback}</span>
        )}
      </div>
    );
  }

  return <span className={className}>{t(translationKey)}</span>;
};