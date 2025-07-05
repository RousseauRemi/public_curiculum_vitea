import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ChevronDown, ChevronUp, Building2, Clock } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useTranslation } from '../../shared/hooks/useTranslation';
import { sortTechnologiesByPriority } from '../../shared/utils/technologyColors';
import TechChip from '../../shared/components/TechChip';
import type { Experience } from '../../store/types';

// Number of most recent experiences shown fully expanded; older ones are condensed
const DETAILED_COUNT = 3;

const ExperienceSection: React.FC = () => {
  const { language, getCVData } = useAppStore();
  const { t } = useTranslation(language);
  const data = getCVData();
  const experiences = useMemo(() => data.experiences, [data.experiences]);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [expandedOldItems, setExpandedOldItems] = useState<Set<number>>(new Set());

  const isFr = language === 'fr';

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const toggleOldExpanded = (id: number) => {
    const newExpanded = new Set(expandedOldItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedOldItems(newExpanded);
  };

  const renderFullCard = (experience: Experience, isCondensable: boolean) => {
    const isExpanded = expandedItems.has(experience.id);

    return (
      <motion.div
        className="experience-card pdf-avoid-break bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden border border-secondary-200"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-start gap-4">
            {/* Company logos */}
            <div className="hidden sm:flex gap-2 flex-shrink-0">
              {experience.logo1 && (
                <div className="bg-white rounded-xl p-2 border border-secondary-200 shadow-sm">
                  <img
                    src={experience.logo1}
                    alt={experience.context || ''}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              {experience.logo2 && (
                <div className="bg-white rounded-xl p-2 border border-secondary-200 shadow-sm">
                  <img
                    src={experience.logo2}
                    alt=""
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-neutral-900 mb-0.5">
                    {experience.nomDeMission}
                  </h3>
                  <p className="text-sm md:text-base font-medium text-neutral-500">
                    {experience.context}
                  </p>
                </div>
                {isCondensable && (
                  <button
                    onClick={() => toggleOldExpanded(experience.id)}
                    className="print-hidden flex-shrink-0 p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-secondary-50 transition-colors"
                    aria-label={isFr ? 'Réduire' : 'Collapse'}
                  >
                    <ChevronUp size={18} />
                  </button>
                )}
              </div>
              {experience.missionEnCours && (
                <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  {isFr ? 'Mission en cours' : 'Current mission'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Key info */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 bg-primary-50 rounded-lg">
                <Calendar size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">{isFr ? 'Période' : 'Period'}</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {experience.dateDebut} - {experience.dateFin || (isFr ? 'Présent' : 'Present')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 bg-primary-50 rounded-lg">
                <MapPin size={16} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">{isFr ? 'Lieu' : 'Location'}</p>
                <p className="text-sm font-semibold text-neutral-900">{experience.localisation}</p>
              </div>
            </div>

            {experience.equipe && (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 bg-primary-50 rounded-lg">
                  <Users size={16} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">{isFr ? 'Équipe' : 'Team'}</p>
                  <p className="text-sm font-semibold text-neutral-900">{experience.equipe}</p>
                </div>
              </div>
            )}
          </div>

          {/* Mission description */}
          <div className="mb-6 pl-4 border-l-2 border-primary-200">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center gap-2">
              <Building2 size={14} className="text-neutral-400" />
              Mission
            </h4>
            <p className="text-neutral-700 leading-relaxed">{experience.mission}</p>
          </div>

          {/* Technologies */}
          {experience.technologies && experience.technologies.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {sortTechnologiesByPriority(experience.technologies).map((tech, idx) => (
                  <TechChip key={idx} technology={tech} />
                ))}
              </div>
            </div>
          )}

          {/* Expandable Details */}
          {(experience.objectives?.length > 0 || experience.detailsMission?.length > 0 || experience.outils?.length > 0) && (
            <div className="border-t border-secondary-200 pt-4">
              <button
                onClick={() => toggleExpanded(experience.id)}
                className="voir-plus-button print-hidden flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200"
                data-testid="expand-experience"
              >
                <span>{isExpanded ? (isFr ? 'Voir moins de détails' : 'Show less details') : (isFr ? 'Voir plus de détails' : 'Show more details')}</span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <div className={`${isExpanded ? 'block' : 'hidden'} expanded-content experience-details`}>
                <motion.div
                  className="mt-6 space-y-6 bg-secondary-50 rounded-xl p-5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Objectives */}
                  {experience.objectives && experience.objectives.length > 0 && (
                    <div className="objectives-list">
                      <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        {isFr ? 'Objectifs' : 'Objectives'}
                      </h4>
                      <ul className="space-y-2">
                        {experience.objectives.map((obj, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700">
                            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Mission Details */}
                  {experience.detailsMission && experience.detailsMission.length > 0 && (
                    <div className="mission-details">
                      <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                        {isFr ? 'Détails de mission' : 'Mission Details'}
                      </h4>
                      <ul className="space-y-2">
                        {experience.detailsMission.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700">
                            <div className="w-1.5 h-1.5 bg-accent-400 rounded-full mt-2 flex-shrink-0"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tools */}
                  {experience.outils && experience.outils.length > 0 && (
                    <div className="tools-list">
                      <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
                        {isFr ? 'Outils & Méthodes' : 'Tools & Methods'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.outils.map((tool, idx) => (
                          <span
                            key={idx}
                            className="bg-white text-neutral-600 text-xs font-medium px-3 py-1.5 rounded-lg border border-secondary-200"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* End Condition */}
                  {experience.conditionDeFinDeMission && !experience.missionEnCours && (
                    <div className="bg-white border border-secondary-200 rounded-lg p-4">
                      <h4 className="font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-neutral-400" />
                        {isFr ? 'Condition de fin' : 'End condition'}
                      </h4>
                      <p className="text-sm text-neutral-600">{experience.conditionDeFinDeMission}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderCompactRow = (experience: Experience) => (
    <button
      onClick={() => toggleOldExpanded(experience.id)}
      className="print-hidden w-full text-left bg-white rounded-xl shadow-sm hover:shadow-card border border-secondary-200 hover:border-secondary-300 transition-all duration-200 p-4 flex items-center gap-4 group"
    >
      {experience.logo1 ? (
        <div className="hidden sm:block bg-white rounded-lg p-1.5 border border-secondary-200 flex-shrink-0">
          <img
            src={experience.logo1}
            alt=""
            className="w-8 h-8 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="hidden sm:flex w-11 h-11 bg-secondary-50 rounded-lg items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-neutral-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-neutral-900 truncate">{experience.nomDeMission}</p>
        <p className="text-sm text-neutral-500 truncate">{experience.context}</p>
      </div>
      <div className="text-right flex-shrink-0 hidden sm:block">
        <p className="text-sm font-medium text-neutral-600">
          {experience.dateDebut} – {experience.dateFin || (isFr ? 'Présent' : 'Present')}
        </p>
        <p className="text-xs text-neutral-400">{experience.localisation}</p>
      </div>
      <ChevronDown size={18} className="text-neutral-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
    </button>
  );

  return (
    <section id="experience" className="py-16 px-4 sm:px-6 lg:px-8 section-light">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-3">{isFr ? 'Parcours' : 'Career'}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 relative inline-block">
            {t('sections.professionalExperience')}
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></span>
          </h2>
        </motion.div>

        {/* Timeline Layout */}
        <div className="relative max-w-5xl mx-auto">
          {/* Left timeline line */}
          <div className="timeline-line hidden lg:block absolute inset-y-0 w-0.5 bg-gradient-to-b from-primary-300 via-primary-200 to-transparent" style={{ left: '16px', top: '40px', bottom: '40px', zIndex: 1 }}></div>

          <div className="space-y-8">
            {experiences.map((experience, index) => {
              const isCondensable = index >= DETAILED_COUNT;
              const isCollapsed = isCondensable && !expandedOldItems.has(experience.id);

              return (
                <div key={experience.id} className="relative">
                  {/* Timeline dot */}
                  <div className="timeline-dot hidden lg:block absolute top-8" style={{ left: '16px', transform: 'translateX(-50%)', zIndex: 10 }}>
                    <motion.div
                      className="w-3 h-3 rounded-full ring-4 ring-white shadow-sm"
                      style={{
                        backgroundColor: experience.missionEnCours ? '#10b981' : '#93c5fd'
                      }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="w-full lg:pl-12 pdf-timeline-adjust"
                  >
                    {isCollapsed ? (
                      <>
                        {renderCompactRow(experience)}
                        {/* Full card still rendered for PDF export */}
                        <div className="pdf-only hidden">
                          {renderFullCard(experience, false)}
                        </div>
                      </>
                    ) : (
                      renderFullCard(experience, isCondensable)
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
