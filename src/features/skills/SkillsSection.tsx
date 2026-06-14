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
import { getTechnologyDotColor } from '../../shared/utils/technologyColors';

const SkillsSection: React.FC = () => {
  const { language, getCVData } = useAppStore();
  const { t } = useTranslation(language);
  const { competenceCategories } = getCVData();
  const [selectedCategory, setSelectedCategory] = useState(0);

  const currentCategory = competenceCategories[selectedCategory];

  // Transform data for radar chart
  const radarData = currentCategory.competences.map(comp => ({
    skill: comp.label,
    value: comp.data,
    fullValue: 3
  }));

  // Group skills by level instead of self-rated progress bars
  const levels = [
    { key: 'advanced', dot: 'bg-accent-500' },
    { key: 'intermediate', dot: 'bg-primary-500' },
    { key: 'junior', dot: 'bg-slate-400' }
  ] as const;

  const groupedSkills = levels
    .map(level => ({
      ...level,
      skills: currentCategory.competences
        .filter(c => c.level === level.key)
        .sort((a, b) => b.data - a.data)
    }))
    .filter(group => group.skills.length > 0);

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
          <div className="bg-white p-3 rounded-lg shadow-lg border border-secondary-200 max-w-xs">
            <p className="font-semibold text-gray-900">{skill.label}</p>
            <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
            <p className="text-sm font-medium mt-2 text-primary-600">
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

    const lineHeight = 14;

    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, index) => (
          <text
            key={index}
            x={0}
            y={-((lines.length - 1) * lineHeight / 2) + (index * lineHeight)}
            textAnchor="middle"
            fill="#334155"
            fontSize={12}
            fontWeight={600}
            dominantBaseline="central"
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  return (
    <SectionWrapper
      id="skills"
      title={t('sections.technicalSkills')}
      eyebrow={language === 'fr' ? 'Expertise' : 'Expertise'}
      className="section-tint relative"
    >

      {/* Category Tabs - Hidden in PDF mode */}
      <div className="flex justify-center mb-10 print-hidden">
        <div className="bg-white rounded-xl p-1.5 inline-flex gap-1.5 shadow-card border border-secondary-200">
          {competenceCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(index)}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                selectedCategory === index
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-secondary-50'
              }`}
            >
              {category.title1} {category.title2}
            </button>
          ))}
        </div>
      </div>

      {/* Web version - Interactive with tabs */}
      <div className="print-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-stretch">
          {/* Radar Chart - Hidden on phone, shown on larger screens */}
          <div className="chart hidden md:flex bg-white p-6 rounded-2xl shadow-card transition-all duration-300 flex-col justify-center min-h-[500px] border border-secondary-200">
            <div className="flex-1 flex items-center justify-center p-4">
              <ResponsiveContainer width="100%" height={450}>
                <RadarChart data={radarData} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                  <defs>
                    <linearGradient id="skillsRadarGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke="var(--color-secondary-200)" />
                  <PolarRadiusAxis
                    domain={[0, 3]}
                    tick={false}
                    tickCount={4}
                    axisLine={false}
                  />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="var(--color-primary-600)"
                    fill="url(#skillsRadarGradient)"
                    fillOpacity={1}
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--color-primary-600)', strokeWidth: 0 }}
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

          {/* Skills grouped by level — dense rows with inline descriptions */}
          <div className="skill-category bg-white rounded-2xl shadow-card border border-secondary-200 p-6 sm:p-8 flex flex-col justify-center">
            <div className="space-y-6">
              {groupedSkills.map((group) => (
                <div key={group.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${group.dot}`} />
                    <h3 className="font-display font-bold text-neutral-900">
                      {t(`skills.${group.key}`)}
                    </h3>
                    <span className="text-xs font-medium text-neutral-400">
                      · {group.skills.length}
                    </span>
                  </div>
                  <div>
                    {group.skills.map((skill) => (
                      <div
                        key={skill.label}
                        className="skill-item flex items-center gap-3 py-2 border-b border-secondary-100 last:border-b-0"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getTechnologyDotColor(skill.label)}`} />
                        <span className="text-sm font-semibold text-neutral-800">{skill.label}</span>
                        <span className="text-xs text-neutral-500 truncate flex-1 text-right min-w-0" title={skill.description}>
                          {skill.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
              <div className="skill-category space-y-3">
                {category.competences
                  .sort((a, b) => b.data - a.data)
                  .map((skill) => (
                    <div
                      key={`${categoryIndex}-${skill.label}`}
                      className="skill-item p-3 rounded-lg border border-secondary-200 bg-white"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-neutral-900">{skill.label}</h4>
                        <span
                          className="skill-level text-xs font-medium px-2 py-1 rounded-full bg-secondary-100 text-neutral-700"
                          data-level={t(`skills.${skill.level}`)}
                        >
                          {t(`skills.${skill.level}`)}
                        </span>
                      </div>
                      <div className="pdf-skill-description">
                        <p className="text-sm text-neutral-600">
                          {skill.description}
                        </p>
                      </div>
                    </div>
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
