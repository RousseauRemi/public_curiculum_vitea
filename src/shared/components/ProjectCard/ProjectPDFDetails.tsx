import React from 'react';
import type { ProjetInterne } from '../../../store/types';
import { getTechnologyColor } from '../../utils/technologyColors';
import { OptimizedImage } from '../OptimizedImage';

interface ProjectPDFDetailsProps {
  project: ProjetInterne;
}

export const ProjectPDFDetails: React.FC<ProjectPDFDetailsProps> = ({ project }) => {
  if (!project.subProjects || project.subProjects.length === 0) return null;

  return (
    <div className="pdf-project-details hidden">
      <div className="mb-4">
        <h4 className="font-semibold text-sm text-neutral-800 mb-2">📋 Description</h4>
        <p className="text-neutral-700 text-sm mb-3">{project.description}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold text-sm text-neutral-800 mb-2">
          🔧 Sous-projets ({project.subProjects.length})
        </h4>
        <div className="space-y-2">
          {project.subProjects.slice(0, 3).map((subProject, idx) => (
            <div key={idx} className="bg-secondary-50 p-4 rounded-lg">
              <h5 className="font-medium text-base text-neutral-800 mb-2">{subProject.name}</h5>
              <p className="text-neutral-700 text-sm mb-3 leading-relaxed">{subProject.description}</p>
              
              {/* Sub-project images */}
              {subProject.images && subProject.images.length > 0 && (
                <div className="mb-3">
                  {subProject.images.length === 1 ? (
                    // Single sub-project image - full width layout
                    <div className="max-w-full">
                      {(() => {
                        const image = subProject.images[0];
                        const imageUrl = typeof image === 'string' ? image : image.url;
                        const imageType = typeof image === 'string' ? 'web' : image.type || 'web';
                        return (
                          <div className="relative max-w-4xl mx-auto">
                            <OptimizedImage
                              src={imageUrl}
                              alt={`${subProject.name} - ${imageType}`}
                              className="project-image-single w-full rounded-lg border border-gray-200"
                              lazy={false}
                            />
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    // Multiple sub-project images - grid layout
                    <div className="grid grid-cols-2 gap-3">
                      {subProject.images.map((image, imgIdx) => {
                        const imageUrl = typeof image === 'string' ? image : image.url;
                        const imageType = typeof image === 'string' ? 'web' : image.type || 'web';
                        return (
                          <div key={imgIdx} className="relative">
                            <OptimizedImage
                              src={imageUrl}
                              alt={`${subProject.name} - ${imageType}`}
                              className="project-image w-full rounded-lg border border-gray-200"
                              lazy={false}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              
              {/* Sub-project technologies */}
              {subProject.technologies && (
                <div className="flex flex-wrap gap-3">
                  {subProject.technologies.map((tech, techIdx) => (
                    <span
                      key={techIdx}
                      className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getTechnologyColor(tech)} text-white`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};