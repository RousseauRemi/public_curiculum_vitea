import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Languages, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import SectionWrapper from '../../shared/components/SectionWrapper';
import useAppStore from '../../store/useAppStore';
import { useTranslation } from '../../shared/hooks/useTranslation';
import type { Recommendation } from '../../store/types';

const RecommendationsSection: React.FC = () => {
  const { language, getCVData } = useAppStore();
  const { t } = useTranslation(language);
  const { recommendations } = getCVData();
  const [translationToggled, setTranslationToggled] = useState<{ [key: number]: boolean }>({});
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const isFr = language === 'fr';

  const toggleTranslation = (id: number) => {
    setTranslationToggled(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpanded = (id: number) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getInitials = (name: string) =>
    name
      .split(/\s+/)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const RecommendationCard: React.FC<{ recommendation: Recommendation; index: number }> = ({ recommendation, index }) => {
    const showTranslation = translationToggled[recommendation.id];
    const isExpanded = expanded[recommendation.id];
    const displayText = showTranslation && recommendation.translated ? recommendation.translated : recommendation.recommendation;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
        className="relative h-full"
      >
        <div className="recommendation-card pdf-avoid-break bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 p-6 sm:p-8 flex flex-col h-full border border-secondary-200">

          {/* Quote icon */}
          <Quote size={28} className="text-primary-200 mb-4 flex-shrink-0" />

          {/* Recommendation Text - Web Version */}
          <div className="web-only flex-1">
            <blockquote>
              <p
                className={`recommendation-text text-neutral-700 leading-relaxed text-sm sm:text-[0.95rem] ${isExpanded ? '' : 'line-clamp-6'}`}
                dangerouslySetInnerHTML={{ __html: `${displayText}` }}
              />
            </blockquote>
            <button
              onClick={() => toggleExpanded(recommendation.id)}
              className="print-hidden mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors"
            >
              {isExpanded
                ? (isFr ? 'Réduire' : 'Show less')
                : (isFr ? 'Lire la suite' : 'Read more')}
              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-secondary-100">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {getInitials(recommendation.nomPersonne)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 leading-tight">{recommendation.nomPersonne}</h3>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                <Briefcase size={11} />
                <span className="truncate">{recommendation.metier} · {recommendation.nomEntreprise}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {recommendation.logo1 && (
                <img
                  src={recommendation.logo1}
                  alt={recommendation.nomEntreprise}
                  className="w-9 h-9 object-contain opacity-70"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              {recommendation.translated && (
                <button
                  onClick={() => toggleTranslation(recommendation.id)}
                  className="print-hidden p-2 rounded-lg text-primary-600 bg-primary-50 hover:text-white hover:bg-primary-600 transition-colors duration-200 border border-primary-200"
                  title={showTranslation ? 'Voir version originale' : 'Voir traduction'}
                >
                  <Languages size={16} />
                </button>
              )}
            </div>
          </div>

          {/* PDF-specific recommendation text - shows both languages based on selection */}
          <div className="pdf-recommendation-details hidden">
            <div className="pt-4 pb-4 space-y-3">
              {language === 'fr' ? (
                <>
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
      </motion.div>
    );
  };

  return (
    <SectionWrapper
      id="recommendations"
      title={t('sections.recommendations')}
      eyebrow={isFr ? 'Ils ont travaillé avec moi' : 'They worked with me'}
      className="section-light"
    >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} index={index} />
        ))}
      </div>

    </SectionWrapper>
  );
};

export default RecommendationsSection;
