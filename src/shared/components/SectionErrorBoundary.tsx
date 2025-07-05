import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName: string;
  showDetails?: boolean;
}

const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({
  children,
  sectionName,
  showDetails = false
}) => {
  const SectionErrorFallback = (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to load {sectionName}
        </h3>
        
        <p className="text-gray-600 mb-6">
          This section encountered an error. Other sections should work normally.
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Page
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={SectionErrorFallback}
      showDetails={showDetails}
      onError={(error, errorInfo) => {
        console.error(`Error in ${sectionName} section:`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default SectionErrorBoundary;