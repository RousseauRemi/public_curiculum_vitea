import { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import SectionWrapper from '../../shared/components/SectionWrapper';
import useAppStore from '../../store/useAppStore';
import { useTranslation } from '../../shared/hooks/useTranslation';
import { getSkillTechnologyColor } from '../../shared/utils/technologyColors';
import type { Competence } from '../../store/types';

const SkillsSection: React.FC = () => {
  const { language, getCVData } = useAppStore();
  const { t } = useTranslation(language);
  const { competenceCategories } = getCVData();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const currentCategory = competenceCategories[selectedCategory];

  // Transform data for radar chart
  const radarData = currentCategory.competences.map(comp => ({
    skill: comp.label,
    value: comp.data,
    fullValue: 3
  }));

  // Custom tooltip
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        skill: string;
        value: number;
        fullValue: number;
      };
    }>;
  }
  
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload[0]) {
      const skill = currentCategory.competences.find(
        c => c.label === payload[0].payload.skill
      );
      if (skill) {
        return (
          <div className="bg-white p-3 rounded-lg shadow-lg border">
            <p className="font-semibold text-gray-900">{skill.label}</p>
            <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
            <p className="text-sm font-medium mt-2" style={{ color: skill.backgroundColor }}>
              {t(`skills.${skill.level}`)}
            </p>
          </div>
        );
      }
    }
    return null;
  };

  interface AxisTickProps {
    payload?: {
      value: string;
    };
    x?: number;
    y?: number;
  }
  
  const CustomAngleAxisTick = ({ payload, x, y }: AxisTickProps) => {
    if (!payload?.value || x === undefined || y === undefined) return null;
    
    const text = payload.value;
    const maxCharsPerLine = 12;
    
    // Split text into words and wrap
    const words = text.split(/[\s/]+/);
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach((word: string) => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    
    const lineHeight = 16;
    const cardWidth = Math.max(Math.max(...lines.map(line => line.length)) * 9 + 20, 80);
    const cardHeight = Math.max(lines.length * lineHeight + 12, 32);
    
    return (
      <g transform={`translate(${x},${y})`}>
        <rect
          x={-cardWidth/2}
          y={-cardHeight/2}
          width={cardWidth}
          height={cardHeight}
          rx={8}
          fill="#1e3a8a"
          stroke="#1e40af"
          strokeWidth={1}
        />
        {lines.map((line, index) => (
          <text
            key={index}
            x={0}
            y={-((lines.length - 1) * lineHeight / 2) + (index * lineHeight)}
            textAnchor="middle"
            fill="white"
            fontSize={12}
            fontWeight="bold"
            dominantBaseline="central"
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  const SkillCard: React.FC<{ skill: Competence }> = ({ skill }) => {
    const levelWidth = (skill.data / 3) * 100;
    
    // Get technology-based colors for this skill
    const techColors = getSkillTechnologyColor(skill.label);
    
    // Color based on skill level for the badge
    const getSkillLevelColor = (level: string) => {
      switch (level) {
        case 'junior':
          return { bg: '#fbbf24', text: '#92400e' }; // Amber - beginner level
        case 'intermediate':
          return { bg: '#3b82f6', text: '#1e40af' }; // Blue - intermediate level
        case 'advanced':
          return { bg: '#10b981', text: '#065f46' }; // Emerald - advanced level
        default:
          return { bg: '#6b7280', text: '#374151' }; // Gray - fallback
      }
    };
    
    const levelColors = getSkillLevelColor(skill.level);
    
    return (
      <div
        className={`skill-item p-4 rounded-lg shadow-card transition-all duration-300 hover:shadow-professional border ${techColors.border} ${techColors.bg}`}
        onMouseEnter={() => setHoveredSkill(skill.label)}
        onMouseLeave={() => setHoveredSkill(null)}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-neutral-900">
            {skill.label}
          </h4>
          <span 
            className="skill-level text-xs font-medium px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: `${levelColors.bg}20`,
              color: levelColors.text 
            }}
            data-level={t(`skills.${skill.level}`)}
          >
            {t(`skills.${skill.level}`)}
          </span>
        </div>
        
        <div className="progress-bar w-full bg-white/50 rounded-full h-3 mb-2 overflow-hidden border border-white/30">
          <div
            className="progress-fill h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              backgroundColor: levelColors.bg,
              width: `${levelWidth}%`
            }}
          />
        </div>
        
        {/* Show description on hover (web) or always (PDF) */}
        {hoveredSkill === skill.label && (
          <div className="pt-2 border-t border-secondary-100 animate-in fade-in duration-200">
            <p className="text-sm text-neutral-600">
              {skill.description}
            </p>
          </div>
        )}
        
        {/* PDF-only description - always visible in PDF */}
        <div className="pdf-skill-description hidden pt-2 border-t border-secondary-100">
          <p className="text-sm text-neutral-600">
            {skill.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <SectionWrapper id="skills" title={t('sections.technicalSkills')} className="bg-gradient-to-br from-gray-50 to-blue-50 relative">
      
      {/* Category Tabs - Hidden in PDF mode */}
      <div className="flex justify-center mb-8 print-hidden">
        <div className="bg-white rounded-xl p-2 inline-flex gap-2 shadow-lg border border-secondary-200">
          {competenceCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === index
                  ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg border border-slate-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:shadow-md border border-transparent'
              }`}
            >
              {category.title1} {category.title2}
            </button>
          ))}
        </div>
      </div>

      {/* Web version - Interactive with tabs */}
      <div className="print-hidden">
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 2xl:items-start">
          {/* Radar Chart - Hidden on phone, shown on larger screens */}
          <div className="chart hidden md:block bg-white p-6 rounded-xl shadow-card hover:shadow-professional transition-all duration-300 flex flex-col justify-center min-h-[500px] border border-secondary-200">
            <div className="flex-1 flex items-center justify-center p-8">
              <ResponsiveContainer width="100%" height={450}>
                <RadarChart data={radarData} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                  <PolarGrid stroke="var(--color-secondary-200)" />
                  <PolarRadiusAxis
                    domain={[0, 3]}
                    tick={{ fontSize: 10 }}
                    tickCount={4}
                    axisLine={false}
                  />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="var(--color-primary-600)"
                    fill="var(--color-primary-500)"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={<CustomAngleAxisTick />}
                    tickSize={50}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skills List */}
          <div className="skill-category space-y-4">
            {currentCategory.competences
              .sort((a, b) => b.data - a.data)
              .map((skill) => (
                <SkillCard key={skill.label} skill={skill} />
              ))
            }
          </div>
        </div>
      </div>

      {/* PDF version - All categories displayed */}
      <div className="pdf-only">
        <div className="space-y-8">
          {competenceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="pdf-skill-category">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                {category.title1} {category.title2}
              </h3>
              <div className="skill-category space-y-4">
                {category.competences
                  .sort((a, b) => b.data - a.data)
                  .map((skill) => (
                    <SkillCard key={`${categoryIndex}-${skill.label}`} skill={skill} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </SectionWrapper>
  );
};

export default SkillsSection;