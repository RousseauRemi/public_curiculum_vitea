import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ChevronDown, ChevronUp, Briefcase, Building2, Clock } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useTranslation } from '../../shared/hooks/useTranslation';
import { getTechnologyColor, sortTechnologiesByPriority } from '../../shared/utils/technologyColors';

const ExperienceSection: React.FC = () => {
  const { language, getCVData } = useAppStore();
  const { t } = useTranslation(language);
  const data = getCVData();
  const experiences = useMemo(() => data.experiences, [data.experiences]);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <section id="experience" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
      <motion.h2 
        className="section-header text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {t('sections.professionalExperience')}
      </motion.h2>
      
      {/* Timeline Layout */}
      <div className="relative max-w-7xl mx-auto">
        {/* Left timeline line */}
        <div className="timeline-line hidden lg:block absolute inset-y-0 w-0.5 bg-gradient-to-b from-slate-300 to-slate-400" style={{ left: '32px', top: '80px', bottom: '80px', zIndex: 1 }}></div>
        
        <div className="space-y-12">
          {experiences.map((experience, index) => {
            const isExpanded = expandedItems.has(experience.id);
            
            return (
              <div key={experience.id} className="relative experience-card pdf-avoid-break">
                {/* Timeline dot */}
                <div className="timeline-dot hidden lg:block absolute top-20" style={{ left: '32px', transform: 'translateX(-50%)', zIndex: 10 }}>
                  <motion.div 
                    className="w-3 h-3 rounded-full ring-4 ring-white shadow-sm"
                    style={{
                      backgroundColor: experience.missionEnCours ? '#10b981' : '#cbd5e1'
                    }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.2 }}
                  >
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Experience card - Full width with animations */}
                  <div className="w-full lg:pl-20 pdf-timeline-adjust">
                  <motion.div 
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                    whileHover={{ 
                      y: -5,
                      scale: 1.02,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    
                    {/* Header with gradient and animations */}
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-6 overflow-hidden">
                      <motion.div 
                        className="absolute top-2 right-2 opacity-10"
                        initial={{ rotate: -10, scale: 0.8 }}
                        whileInView={{ rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      >
                        <Briefcase size={60} className="text-slate-300" />
                      </motion.div>
                      
                      {/* Additional decorative elements */}
                      <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
                      
                      <div className="relative z-10 flex items-start gap-1 sm:gap-2 md:gap-4">
                        {/* Company logos in header with animations */}
                        <motion.div 
                          className="hidden sm:flex gap-1 flex-shrink-0"
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
                        >
                          {experience.logo1 && (
                            <motion.div 
                              className="bg-white rounded-md md:rounded-xl p-1 md:p-2 shadow-sm"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <img
                                src={experience.logo1}
                                alt={experience.context || ''}
                                className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </motion.div>
                          )}
                          {experience.logo2 && (
                            <motion.div 
                              className="bg-white rounded-md md:rounded-xl p-1 md:p-2 shadow-sm"
                              whileHover={{ scale: 1.1, rotate: -5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <img
                                src={experience.logo2}
                                alt=""
                                className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </motion.div>
                          )}
                        </motion.div>
                        
                        <motion.div 
                          className="flex-1 min-w-0"
                          initial={{ y: 10, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        >
                          <motion.h3 
                            className="text-sm sm:text-lg md:text-xl font-bold mb-1 text-white"
                            whileHover={{ scale: 1.02 }}
                          >
                            {experience.nomDeMission}
                          </motion.h3>
                          <motion.p 
                            className="text-xs sm:text-sm md:text-lg font-medium text-slate-200"
                            initial={{ x: 10, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 0.9 }}
                            transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                          >
                            {experience.context}
                          </motion.p>
                          {experience.missionEnCours && (
                            <motion.span 
                              className="inline-flex items-center gap-1 sm:gap-2 bg-emerald-500 text-white text-xs font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-sm mt-2"
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                            >
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                              <span className="hidden sm:inline">{language === 'fr' ? 'MISSION EN COURS' : 'CURRENT MISSION'}</span>
                              <span className="sm:hidden">{language === 'fr' ? 'EN COURS' : 'CURRENT'}</span>
                            </motion.span>
                          )}
                        </motion.div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Key info with color-coded icons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-3">
                          {/* Date - Blue */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
                              <Calendar size={18} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500 font-medium">Période</p>
                              <p className="text-base font-semibold text-slate-900">
                                {experience.dateDebut} - {experience.dateFin || (language === 'fr' ? 'Présent' : 'Present')}
                              </p>
                            </div>
                          </div>
                          
                          {/* Location - Red */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded-xl">
                              <MapPin size={18} className="text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm text-neutral-500 font-medium">Lieu</p>
                              <p className="font-semibold text-neutral-800">{experience.localisation}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Team - Green */}
                          {experience.equipe && (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-xl">
                                <Users size={18} className="text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-sm text-neutral-500 font-medium">Équipe</p>
                                <p className="font-semibold text-neutral-800">{experience.equipe}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mission description */}
                      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                          <Building2 size={16} className="text-slate-600" />
                          Mission
                        </h4>
                        <p className="text-neutral-700 leading-relaxed">{experience.mission}</p>
                      </div>

                      {/* Technologies with better styling and animations */}
                      {experience.technologies && experience.technologies.length > 0 && (
                        <motion.div 
                          className="mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                        >
                          <h4 className="font-semibold text-neutral-900 mb-3">Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {sortTechnologiesByPriority(experience.technologies).map((tech, idx) => (
                              <motion.span
                                key={idx}
                                className={`tech-badge bg-gradient-to-r ${getTechnologyColor(tech)} text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105`}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                  duration: 0.3, 
                                  delay: index * 0.1 + 0.6 + (idx * 0.05) 
                                }}
                                whileHover={{ 
                                  scale: 1.1,
                                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                                }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Expandable Details */}
                      {(experience.objectives?.length > 0 || experience.detailsMission?.length > 0 || experience.outils?.length > 0) && (
                        <div className="border-t border-secondary-200 pt-4">
                          <button
                            onClick={() => toggleExpanded(experience.id)}
                            className="voir-plus-button print-hidden flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200"
                            data-testid="expand-experience"
                          >
                            <span>{isExpanded ? (language === 'fr' ? 'Voir moins de détails' : 'Show less details') : (language === 'fr' ? 'Voir plus de détails' : 'Show more details')}</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>

                          <div className={`${isExpanded ? 'block' : 'hidden'} expanded-content experience-details`}>
                            <motion.div 
                              className="mt-6 space-y-6 bg-secondary-50 rounded-lg p-4"
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
                                    {language === 'fr' ? 'Objectifs' : 'Objectives'}
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
                                    {language === 'fr' ? 'Détails de mission' : 'Mission Details'}
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
                                    <div className="w-2 h-2 bg-success-600 rounded-full"></div>
                                    {language === 'fr' ? 'Outils & Méthodes' : 'Tools & Methods'}
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {experience.outils.map((tool, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-white text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200"
                                      >
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* End Condition */}
                              {experience.conditionDeFinDeMission && !experience.missionEnCours && (
                                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                                  <h4 className="font-semibold text-warning-800 mb-2 flex items-center gap-2">
                                    <Clock size={16} />
                                    {language === 'fr' ? 'Condition de fin' : 'End condition'}
                                  </h4>
                                  <p className="text-sm text-warning-700">{experience.conditionDeFinDeMission}</p>
                                </div>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  </div>
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