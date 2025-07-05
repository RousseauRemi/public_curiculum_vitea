import { useState } from 'react';
import { motion } from 'framer-motion';
import {Building2, Briefcase, Languages} from 'lucide-react';
import SectionWrapper from '../../shared/components/SectionWrapper';
import useAppStore from '../../store/useAppStore';
import { useTranslation } from '../../shared/hooks/useTranslation';
import { useAnimationOnce } from '../../shared/hooks/useAnimationOnce';
import type { Recommendation } from '../../store/types';

const RecommendationsSection: React.FC = () => {
  const { language, getCVData } = useAppStore();
  const { t } = useTranslation(language);
  const { recommendations } = getCVData();
  const [translationToggled, setTranslationToggled] = useState<{ [key: number]: boolean }>({});

  const toggleTranslation = (id: number) => {
    setTranslationToggled(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const RecommendationCard: React.FC<{ recommendation: Recommendation; index: number }> = ({ recommendation, index }) => {
    const { ref, hasAnimated, shouldAnimate } = useAnimationOnce(`recommendation-${recommendation.id}`);
    const showTranslation = translationToggled[recommendation.id];
    const displayText = showTranslation && recommendation.translated ? recommendation.translated : recommendation.recommendation;

    // If already animated, render as static div
    if (hasAnimated) {
      return (
        <div className="relative group">
          <div className="recommendation-card pdf-avoid-break bg-white rounded-xl shadow-card hover:shadow-professional transition-all duration-300 
            p-6 flex flex-col hover:-translate-y-1 border border-secondary-200">

            {/* Company Logo and Info */}
            <div className="flex items-start gap-4 mb-4">
              {recommendation.logo1 && (
                <img
                  src={recommendation.logo1}
                  alt={recommendation.nomEntreprise}
                  className="w-16 h-16 object-contain opacity-80 group-hover:opacity-100 
                    transition-opacity duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              
              <div className="flex-1">
                <h3 className="font-bold text-neutral-900 text-lg">{recommendation.nomPersonne}</h3>
                <div className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
                  <Briefcase size={14} />
                  <span>{recommendation.metier}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Building2 size={14} />
                  <span>{recommendation.nomEntreprise}</span>
                </div>
              </div>
              
              {/* Translation Button - Top Right */}
              {recommendation.translated && (
                <motion.button
                  onClick={() => toggleTranslation(recommendation.id)}
                  className="print-hidden p-3 rounded-lg text-primary-600 bg-primary-50 hover:text-white hover:bg-primary-600 transition-colors duration-200 border border-primary-200"
                  title={showTranslation ? 'Voir version originale' : 'Voir traduction'}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Languages size={20} />
                </motion.button>
              )}
            </div>

            {/* Recommendation Text - Web Version */}
            <div className="web-only">
              <blockquote className="flex-1 relative pt-4 pb-4">
                <p 
                  className="recommendation-text text-neutral-700 italic leading-relaxed text-sm relative z-10"
                  dangerouslySetInnerHTML={{ __html: `${displayText}` }}
                />
                
                {/* Decorative quote marks - hidden when translation is active */}
                {!showTranslation && (
                  <>
                    <span className="absolute -top-1 -left-1 text-4xl text-primary-100 font-serif 
                      select-none pointer-events-none z-0">
                      "
                    </span>
                    <span className="absolute -bottom-3 -right-1 text-4xl text-primary-100 font-serif 
                      select-none pointer-events-none transform rotate-180 z-0">
                      "
                    </span>
                  </>
                )}
              </blockquote>
            </div>

            {/* PDF-specific recommendation text - shows both languages based on selection */}
            <div className="pdf-recommendation-details hidden">
              <div className="pt-4 pb-4 space-y-3">
                {language === 'fr' ? (
                  <>
                    {/* French version when French is selected */}
                    <div>
                      <h5 className="text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wide">
                        Recommandation (Français):
                      </h5>
                      <blockquote className="relative">
                        <p 
                          className="text-neutral-700 italic leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{ __html: recommendation.translated || recommendation.recommendation }}
                        />
                      </blockquote>
                    </div>
                    
                    {/* English version when available */}
                    {recommendation.translated && (
                      <div>
                        <h5 className="text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wide">
                          Recommandation (Anglais):
                        </h5>
                        <blockquote className="relative">
                          <p 
                            className="text-neutral-700 italic leading-relaxed text-sm"
                            dangerouslySetInnerHTML={{ __html: recommendation.recommendation }}
                          />
                        </blockquote>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* English first when English is selected */}
                    <div>
                      <h5 className="text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wide">
                        Recommendation (English):
                      </h5>
                      <blockquote className="relative">
                        <p 
                          className="text-neutral-700 italic leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{ __html: recommendation.recommendation }}
                        />
                      </blockquote>
                    </div>
                    
                    {/* French as translation when English is selected */}
                    {recommendation.translated && (
                      <div>
                        <h5 className="text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wide">
                          Recommendation (French):
                        </h5>
                        <blockquote className="relative">
                          <p 
                            className="text-neutral-700 italic leading-relaxed text-sm"
                            dangerouslySetInnerHTML={{ __html: recommendation.translated }}
                          />
                        </blockquote>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Decorative element */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent 
            rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 
            pointer-events-none"></div>
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
        className="relative group"
      >
        <div className="recommendation-card pdf-avoid-break bg-white rounded-xl shadow-card hover:shadow-professional transition-all duration-300 
          p-6 flex flex-col border border-secondary-200">

          {/* Company Logo and Info */}
          <div className="flex items-start gap-4 mb-4">
            {recommendation.logo1 && (
              <img
                src={recommendation.logo1}
                alt={recommendation.nomEntreprise}
                className="w-16 h-16 object-contain opacity-80 group-hover:opacity-100 
                  transition-opacity duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{recommendation.nomPersonne}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Briefcase size={14} />
                <span>{recommendation.metier}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 size={14} />
                <span>{recommendation.nomEntreprise}</span>
              </div>
            </div>
            
            {/* Translation Button - Top Right */}
            {recommendation.translated && (
              <motion.button
                onClick={() => toggleTranslation(recommendation.id)}
                className="print-hidden p-3 rounded-lg text-primary-600 bg-primary-50 hover:text-white hover:bg-primary-600 transition-colors duration-200 border border-primary-200"
                title={showTranslation ? 'Voir version originale' : 'Voir traduction'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Languages size={20} />
              </motion.button>
            )}
          </div>

          {/* Recommendation Text - Web Version */}
          <div className="web-only">
            <blockquote className="flex-1 relative pt-4 pb-4">
              <p 
                className="recommendation-text text-gray-700 italic leading-relaxed text-sm relative z-10"
                dangerouslySetInnerHTML={{ __html: `${displayText}` }}
              />
              
              {/* Decorative quote marks - hidden when translation is active */}
              {!showTranslation && (
                <>
                  <span className="absolute -top-1 -left-1 text-4xl text-primary-100 font-serif 
                    select-none pointer-events-none z-0">
                    "
                  </span>
                  <span className="absolute -bottom-3 -right-1 text-4xl text-primary-100 font-serif 
                    select-none pointer-events-none transform rotate-180 z-0">
                    "
                  </span>
                </>
              )}
            </blockquote>
          </div>

          {/* PDF-specific recommendation text - shows both languages based on selection */}
          <div className="pdf-recommendation-details hidden">
            <div className="pt-4 pb-4 space-y-3">
              {language === 'fr' ? (
                <>
                  {/* French version when French is selected */}
                  <div>
                    <h5 className="text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wide">
                      Recommandation (Français):
                    </h5>
                    <blockquote className="relative">
                      <p 
                        className="text-neutral-700 italic leading-relaxed text-sm"
                        dangerouslySetInnerHTML={{ __html: recommendation.translated || recommendation.recommendation }}
                      />
                    </blockquote>
                  </div>
                  
                  {/* English version when available */}
                  {recommendation.translated && (
                    <div>
                      <h5 className="text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wide">
                        Recommandation (Anglais):
                      </h5>
                      <blockquote className="relative">
                        <p 
                          className="text-neutral-700 italic leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{ __html: recommendation.recommendation }}
                        />
                      </blockquote>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* English first when English is selected */}
                  <div>
                    <h5 className="text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wide">
                      Recommendation (English):
                    </h5>
                    <blockquote className="relative">
                      <p 
                        className="text-neutral-700 italic leading-relaxed text-sm"
                        dangerouslySetInnerHTML={{ __html: recommendation.recommendation }}
                      />
                    </blockquote>
                  </div>
                  
                  {/* French as translation when English is selected */}
                  {recommendation.translated && (
                    <div>
                      <h5 className="text-xs font-semibold text-neutral-600 mb-1 uppercase tracking-wide">
                        Recommendation (French):
                      </h5>
                      <blockquote className="relative">
                        <p 
                          className="text-neutral-700 italic leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{ __html: recommendation.translated }}
                        />
                      </blockquote>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent 
          rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 
          pointer-events-none"></div>
      </motion.div>
    );
  };

  return (
    <SectionWrapper id="recommendations" title={t('sections.recommendations')} className="bg-gradient-to-br from-gray-50 to-slate-100">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} index={index} />
        ))}
      </div>

    </SectionWrapper>
  );
};

export default RecommendationsSection;