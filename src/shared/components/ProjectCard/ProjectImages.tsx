import React from 'react';
import type { ProjetInterne } from '../../../store/types';
import { OptimizedImage } from '../OptimizedImage';
import { getImageAriaLabel } from '../../utils/accessibility';
import useAppStore from '../../../store/useAppStore';

interface ProjectImagesProps {
  project: ProjetInterne;
  projectName: string;
  isHiddenInPDF?: boolean;
}

export const ProjectImages: React.FC<ProjectImagesProps> = ({ 
  project, 
  projectName, 
  isHiddenInPDF = false 
}) => {
  const { language } = useAppStore();
  const mainImages = project.images && project.images.length > 0 ? [...project.images] : [];
  
  if (mainImages.length === 0) return null;
  
  // Sort images by type: web first, then mobile, then photo
  const sortedImages = [...mainImages].sort((a, b) => {
    const typeOrder: { [key: string]: number } = { web: 0, mobile: 1, photo: 2 };
    const aType = typeof a === 'string' ? 'web' : a.type || 'web';
    const bType = typeof b === 'string' ? 'web' : b.type || 'web';
    return (typeOrder[aType] || 0) - (typeOrder[bType] || 0);
  });
  
  const mainImage = sortedImages[0];
  const mainImageUrl = typeof mainImage === 'string' ? mainImage : mainImage.url;
  
  return (
    <div className={isHiddenInPDF ? "print-hidden" : ""}>
      {/* Web version - show only first image */}
      <div className="mt-4 rounded-lg overflow-hidden relative generating-pdf:hidden">
        <OptimizedImage
          src={mainImageUrl}
          alt={getImageAriaLabel(projectName, typeof mainImage === 'string' ? 'web' : mainImage.type || 'web', language)}
          className="w-full h-32 group-hover:scale-105 transition-transform duration-300"
          lazy={true}
        />
      </div>
      
      {/* PDF version - show all images with proper layout */}
      <div className="hidden generating-pdf:block mt-4">
        {sortedImages.length === 1 ? (
          // Single image - full width layout
          <div className="max-w-full">
            {(() => {
              const image = sortedImages[0];
              const imageUrl = typeof image === 'string' ? image : image.url;
              const imageType = typeof image === 'string' ? 'web' : image.type || 'web';
              return (
                <div className="relative max-w-4xl mx-auto">
                  <OptimizedImage
                    src={imageUrl}
                    alt={getImageAriaLabel(projectName, imageType, language)}
                    className="project-image-single w-full rounded-lg border border-gray-200"
                    lazy={false}
                  />
                </div>
              );
            })()}
          </div>
        ) : (
          // Multiple images - grid layout
          <div className="grid grid-cols-2 gap-3">
            {sortedImages.map((image, imgIdx) => {
              const imageUrl = typeof image === 'string' ? image : image.url;
              const imageType = typeof image === 'string' ? 'web' : image.type || 'web';
              return (
                <div key={imgIdx} className="relative">
                  <OptimizedImage
                    src={imageUrl}
                    alt={getImageAriaLabel(projectName, imageType, language)}
                    className="project-image w-full rounded-lg border border-gray-200"
                    lazy={false}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};