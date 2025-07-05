import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import SectionWrapper from '../../shared/components/SectionWrapper';
import useAppStore from '../../store/useAppStore';
import { useTranslation } from '../../shared/hooks/useTranslation';

const EducationSection: React.FC = () => {
  const { language, getCVData } = useAppStore();
  const { t } = useTranslation(language);
  const { formations } = getCVData();

  return (
    <SectionWrapper
      id="education"
      title={t('sections.education')}
      eyebrow={language === 'fr' ? 'Formation' : 'Education'}
      className="section-tint"
    >

      {/* Timeline layout for better visual flow */}
      <div className="relative max-w-6xl mx-auto">
        {/* Central timeline line */}
        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 inset-y-0 w-0.5 bg-gradient-to-b from-primary-300 via-primary-200 to-transparent" style={{ top: '80px', bottom: '80px', zIndex: 1 }}></div>
        
        <div className="space-y-12">
          {formations.map((formation, index) => {
            const isLeft = index % 2 === 0;
            
            return (
              <div key={formation.id} className="relative">
                {/* Timeline dot - positioned to align with card center */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-20" style={{ zIndex: 10 }}>
                  <motion.div 
                    className="w-3 h-3 rounded-full ring-4 ring-white shadow-sm"
                    style={{
                      backgroundColor: '#3b82f6'
                    }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex ${isLeft ? 'lg:justify-start' : 'lg:justify-end'}`}
                >
                  {/* Education card */}
                  <div className={`w-full lg:w-5/12`}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="education-card pdf-avoid-break bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden border border-secondary-200"
                  >
                    {/* Header */}
                    <div className="relative p-6 pb-0">
                      <div className="absolute top-4 right-4 opacity-[0.06]">
                        <GraduationCap size={56} className="text-neutral-900" />
                      </div>

                      <div className="relative z-10 flex items-center gap-4">
                        {/* School Logo in header */}
                        {formation.image && (
                          <div className="flex-shrink-0 bg-white rounded-xl p-2.5 border border-secondary-200 shadow-sm">
                            <img
                              src={formation.image}
                              alt={formation.nomEcole}
                              className="h-9 w-auto object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div>
                          <h3 className="font-display text-lg font-bold mb-0.5 text-neutral-900">{formation.nomFormation}</h3>
                          <p className="text-base font-medium text-neutral-500">{formation.nomEcole}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content - Two column layout */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column - Education Info */}
                        <div className="flex flex-col justify-center space-y-6">
                          {/* Date - Prominent */}
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Calendar size={18} className="text-primary-600" />
                              <span className="text-base font-semibold text-neutral-800">
                                {formation.dateDebut} - {formation.dateFin}
                              </span>
                            </div>
                            <div className="w-12 h-0.5 bg-primary-300 rounded-full mx-auto"></div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-neutral-500 justify-center">
                            <MapPin size={15} className="text-primary-600" />
                            <span className="text-sm font-medium">{formation.localisation}</span>
                          </div>
                        </div>

                        {/* Right column - Diplomas */}
                        {formation.diplomes.length > 0 && (
                          <div className="flex flex-col">
                            <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                              <Award size={16} className="text-primary-600" />
                              {t('education.diplomas')}
                            </h4>
                            <div className="space-y-2 flex-1">
                              {formation.diplomes.map((diplome, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-neutral-700"
                                >
                                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{diplome}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default EducationSection;