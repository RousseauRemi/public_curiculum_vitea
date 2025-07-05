import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import useAppStore from '../../../store/useAppStore';
import { getStatusAriaLabel } from '../../utils/accessibility';

interface StateConfig {
  icon: React.ComponentType<{ size?: number }>;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const stateConfig: Record<string, StateConfig> = {
  enReflexion: {
    icon: ({ size = 16 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12h8M12 8v8"/>
      </svg>
    ),
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-200'
  },
  demarre: {
    icon: ({ size = 16 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5,3 19,12 5,21"/>
      </svg>
    ),
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200'
  },
  enCours: {
    icon: ({ size = 16 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 6v6l4 2"/>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ),
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200'
  },
  termine: {
    icon: ({ size = 16 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20,6 9,17 4,12"/>
      </svg>
    ),
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200'
  },
  archive: {
    icon: ({ size = 16 }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6v6H9z"/>
      </svg>
    ),
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200'
  }
};

interface ProjectStatusBadgeProps {
  status?: string;
  statusColor?: string;
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status, statusColor }) => {
  const { language } = useAppStore();
  const { t } = useTranslation(language);
  
  // Normalize status for consistent usage
  const normalizedStatus = (() => {
    if (!status || typeof status !== 'string') {
      return 'enCours'; // Default fallback
    }
    const normalized = status.toLowerCase().replace(/\s+/g, '');
    const statusMap: Record<string, string> = {
      'enreflexion': 'enReflexion',
      'encours': 'enCours',
      'termine': 'termine',
      'demarre': 'demarre',
      'archive': 'archive'
    };
    return statusMap[normalized] || 'enCours';
  })();
  
  const config = stateConfig[normalizedStatus] || stateConfig['enCours'];
  const Icon = config.icon;
  
  // Default statusColor fallback
  const safeStatusColor = statusColor || '#f59e0b';

  return (
    <>
      <div className="h-1" style={{ backgroundColor: safeStatusColor }} aria-hidden="true"></div>
      <div className="flex items-center gap-2">
        <div 
          className={`p-2 rounded-lg ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
          aria-label={getStatusAriaLabel(normalizedStatus, language)}
          role="img"
          aria-hidden="false"
        >
          <Icon size={20} />
        </div>
        <span 
          className={`text-xs font-medium px-2 py-1 rounded-full ${config.bgColor} ${config.textColor}`}
          aria-label={getStatusAriaLabel(normalizedStatus, language)}
        >
          {t(`projects.states.${normalizedStatus}`)}
        </span>
      </div>
    </>
  );
};