import { Document, Page, Text, View, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';
import type { CVData, ProjetInterne } from '../../../store/types';
import { getTechnologyDotHex } from '../../utils/technologyColors';

// Same fonts as the website (index.css): Inter for body, Sora for display
const fontBase = `${window.location.origin}/fonts`;
Font.register({
  family: 'Inter',
  fonts: [
    { src: `${fontBase}/inter-latin-400-normal.ttf`, fontWeight: 400 },
    { src: `${fontBase}/inter-latin-400-italic.ttf`, fontWeight: 400, fontStyle: 'italic' },
    { src: `${fontBase}/inter-latin-600-normal.ttf`, fontWeight: 600 },
    { src: `${fontBase}/inter-latin-700-normal.ttf`, fontWeight: 700 },
  ],
});
Font.register({
  family: 'Sora',
  fonts: [
    { src: `${fontBase}/sora-latin-600-normal.ttf`, fontWeight: 600 },
    { src: `${fontBase}/sora-latin-700-normal.ttf`, fontWeight: 700 },
  ],
});
// No hyphenation: ragged-right text reads better than broken words
Font.registerHyphenationCallback((word) => [word]);

// Brand palette — mirrors the website theme (theme.css)
const C = {
  ink: '#0f172a',
  body: '#334155',
  muted: '#64748b',
  faint: '#94a3b8',
  primary: '#2563eb',
  primaryLight: '#93c5fd',
  accent: '#14b8a6',
  accentLight: '#2dd4bf',
  accentDark: '#0d9488',
  border: '#e2e8f0',
  track: '#e8edf4',
  soft: '#f8fafc',
  heroInk: '#f8fafc',
  heroMuted: '#cbd5e1',
};

const HERO_HEIGHT = 168;

const s = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 52,
    paddingHorizontal: 42,
    fontFamily: 'Inter',
    fontSize: 9,
    color: C.body,
    backgroundColor: '#ffffff',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    flexDirection: 'row',
  },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 42,
    right: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: `1 solid ${C.border}`,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    color: C.faint,
  },
  // Hero header (page 1, full-bleed dark band)
  heroBand: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
    backgroundColor: C.ink,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HERO_HEIGHT - 36 - 18,
    marginBottom: 44,
  },
  name: {
    fontFamily: 'Sora',
    fontWeight: 700,
    fontSize: 25,
    color: C.heroInk,
    letterSpacing: -0.5,
  },
  role: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 11.5,
    color: C.accentLight,
    marginTop: 4,
  },
  heroLine: {
    fontSize: 8.5,
    color: C.heroMuted,
    marginTop: 9,
  },
  profileImage: {
    width: 78,
    height: 78,
    borderRadius: 14,
    border: '2 solid #334155',
  },
  // Sections
  section: {
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 7,
    fontWeight: 600,
    color: C.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  sectionTitle: {
    fontFamily: 'Sora',
    fontWeight: 700,
    fontSize: 14.5,
    color: C.ink,
    letterSpacing: -0.3,
  },
  sectionUnderline: {
    width: 34,
    height: 2.5,
    backgroundColor: C.accent,
    borderRadius: 2,
    marginTop: 5,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 9,
    lineHeight: 1.55,
    color: C.body,
  },
  // Timeline (experiences)
  timeline: {
    borderLeft: `1.5 solid ${C.border}`,
    marginLeft: 4,
    paddingLeft: 16,
  },
  timelineEntry: {
    marginBottom: 14,
  },
  timelineDot: {
    position: 'absolute',
    left: -21.5,
    top: 2,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#ffffff',
    border: `2 solid ${C.primary}`,
  },
  entryTitle: {
    fontWeight: 700,
    fontSize: 11,
    color: C.ink,
  },
  entryCompany: {
    fontWeight: 600,
    fontSize: 9.5,
    color: C.primary,
    marginTop: 2,
  },
  datePill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 9,
    paddingVertical: 2.5,
    paddingHorizontal: 7,
    fontSize: 7.5,
    color: '#475569',
  },
  bullet: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: C.body,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 1.5,
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.accent,
    marginTop: 4,
    marginRight: 5,
  },
  // Chips
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.soft,
    border: `1 solid ${C.border}`,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  chipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  chipText: {
    fontSize: 7.5,
    color: C.body,
  },
  // Cards (skills, education, projects)
  card: {
    backgroundColor: '#ffffff',
    border: `1 solid ${C.border}`,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  softCard: {
    backgroundColor: C.soft,
    borderRadius: 10,
    padding: 12,
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: 10.5,
    color: C.ink,
  },
  cardSubtitle: {
    fontWeight: 600,
    fontSize: 9,
    color: C.primary,
    marginTop: 2,
  },
  dates: {
    fontSize: 8,
    color: C.muted,
  },
  // Skills
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  skillLabel: {
    flex: 1,
    fontSize: 8.5,
    color: C.body,
    paddingRight: 6,
  },
  barTrack: {
    width: 104,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.track,
  },
  barFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: C.primary,
  },
  levelText: {
    fontSize: 7,
    color: C.faint,
    width: 56,
    textAlign: 'right',
  },
  // Recommendations
  quoteCard: {
    backgroundColor: C.soft,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 8,
    fontWeight: 700,
    color: '#ffffff',
  },
  quoteText: {
    fontSize: 8.5,
    lineHeight: 1.6,
    color: C.body,
    fontStyle: 'italic',
    marginTop: 8,
  },
});

const STATUS_COLORS: Record<string, string> = {
  enCours: '#f59e0b',
  termine: '#059669',
  demarre: '#2563eb',
  enReflexion: '#8b5cf6',
  archive: '#94a3b8',
};

const LEVEL_RATIO: Record<string, number> = {
  advanced: 0.95,
  intermediate: 0.65,
  junior: 0.4,
};

const SITE_URL = 'remi-rousseau-cv.netlify.app';

export const EnhancedCVDocument = ({ data, language }: { data: CVData; language: string }) => {
  const isEnglish = language === 'en';
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const resolveImagePath = (imagePath: string): string =>
    imagePath.startsWith('/') ? `${window.location.origin}${imagePath}` : imagePath;

  const renderImage = (src: string, style: unknown, key?: string | number) => {
    if (!src) return null;
    try {
      // @ts-expect-error - PDF style type issue
      return <Image key={key} style={style} src={src} />;
    } catch {
      return null;
    }
  };

  // Recommendation text: pick the right language, then strip the HTML the web view renders
  const getRecommendationText = (rec: { recommendation: string; translated?: string }): string => {
    const raw = !isEnglish ? rec.translated || rec.recommendation : rec.recommendation;
    return raw
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const initials = (fullName: string): string =>
    fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('');

  const getAllTechnologies = (project: ProjetInterne): string[] => {
    const fromSubs = project.subProjects?.flatMap((sp) => sp.technologies || []) || [];
    return [...new Set([...fromSubs, ...(project.technologies || [])])];
  };

  const statusLabel = (status: string): string => {
    const labels: Record<string, [string, string]> = {
      termine: ['Terminé', 'Completed'],
      enCours: ['En cours', 'In progress'],
      demarre: ['Démarré', 'Started'],
      enReflexion: ['En réflexion', 'Planned'],
      archive: ['Archivé', 'Archived'],
    };
    const pair = labels[status];
    return pair ? t(pair[0], pair[1]) : status;
  };

  const levelLabel = (level: string): string => {
    switch (level) {
      case 'advanced': return t('Avancé', 'Advanced');
      case 'intermediate': return t('Intermédiaire', 'Intermediate');
      default: return 'Junior';
    }
  };

  // "Depuis 2024" instead of "2024 – en cours": the status pill already says it's ongoing
  const projectDates = (project: ProjetInterne): string =>
    project.endDate
      ? `${project.startDate} – ${project.endDate}`
      : t(`Depuis ${project.startDate?.toLowerCase()}`, `Since ${project.startDate}`);

  const Chip = ({ label, dot }: { label: string; dot?: string }) => (
    <View style={s.chip}>
      <View style={[s.chipDot, { backgroundColor: dot || getTechnologyDotHex(label) }]} />
      <Text style={s.chipText}>{label}</Text>
    </View>
  );

  const SectionHeader = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
    <View minPresenceAhead={70}>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionUnderline} />
    </View>
  );

  const Bullet = ({ children }: { children: string }) => (
    <View style={s.bulletRow}>
      <View style={s.bulletDot} />
      <Text style={s.bullet}>{children}</Text>
    </View>
  );

  const StatusBadge = ({ status, small }: { status: string; small?: boolean }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: small ? 4 : 5,
          height: small ? 4 : 5,
          borderRadius: 2.5,
          backgroundColor: STATUS_COLORS[status] || C.faint,
          marginRight: 4,
        }}
      />
      <Text style={{ fontSize: small ? 7 : 7.5, color: C.muted }}>{statusLabel(status)}</Text>
    </View>
  );

  const detailedExperiences = data.experiences.slice(0, 3);
  const earlierExperiences = data.experiences.slice(3);
  const featuredProjects = (data.projetsInternes || []).slice(0, 4);
  const otherProjects = (data.projetsInternes || []).slice(4);

  return (
    <Document
      title={`CV ${data.personalInfo.prenom} ${data.personalInfo.nom}`}
      author={`${data.personalInfo.prenom} ${data.personalInfo.nom}`}
    >
      <Page size="A4" style={s.page} wrap>
        {/* Brand top bar */}
        <View style={s.topBar} fixed>
          <View style={{ flex: 7, backgroundColor: C.primary }} />
          <View style={{ flex: 2, backgroundColor: C.accentDark }} />
          <View style={{ flex: 1, backgroundColor: C.accent }} />
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            {data.personalInfo.prenom} {data.personalInfo.nom} · {data.personalInfo.email} · {SITE_URL}
          </Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>

        {/* ============ HERO HEADER ============ */}
        <View style={s.heroBand} />
        <View style={s.heroContent}>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>
              {data.personalInfo.prenom} {data.personalInfo.nom}
            </Text>
            <Text style={s.role}>{t('Développeur Fullstack', 'Fullstack Developer')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#4ade80', marginRight: 4 }} />
              <Text style={{ fontSize: 7.5, color: C.heroMuted }}>
                {t('En mission · ouvert aux opportunités', 'On assignment · open to opportunities')}
              </Text>
            </View>
            <Text style={s.heroLine}>
              <Link src={`mailto:${data.personalInfo.email}`} style={{ color: C.heroMuted, textDecoration: 'none' }}>
                {data.personalInfo.email}
              </Link>
              {'   ·   '}{data.personalInfo.localisation}
              {'   ·   '}{t(`${data.personalInfo.age} ans`, `${data.personalInfo.age} years old`)}
            </Text>
            <Text style={[s.heroLine, { marginTop: 3 }]}>
              <Link src={data.personalInfo.linkedin} style={{ color: C.primaryLight, textDecoration: 'none' }}>
                {data.personalInfo.linkedin.replace('https://www.', '')}
              </Link>
            </Text>
          </View>
          {renderImage(resolveImagePath(data.personalInfo.profileImage), s.profileImage)}
        </View>

        {/* ============ PROFILE ============ */}
        <View style={s.section}>
          <SectionHeader eyebrow={t('Qui je suis', 'Who I am')} title={t('Profil', 'Profile')} />
          <Text style={s.paragraph}>{data.personalInfo.description}</Text>
          <View style={s.chipsRow}>
            {data.personalInfo.passions.map((passion, idx) => (
              <Chip key={idx} label={passion} dot={C.accent} />
            ))}
          </View>
        </View>

        {/* ============ EXPERIENCE (timeline) ============ */}
        <View style={s.section}>
          <SectionHeader
            eyebrow={t('Parcours', 'Career')}
            title={t('Expérience professionnelle', 'Professional Experience')}
          />
          <View style={s.timeline}>
            {detailedExperiences.map((exp) => (
              <View key={exp.id} style={s.timelineEntry} wrap={false}>
                <View style={s.timelineDot} />
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={s.entryTitle}>{exp.nomDeMission}</Text>
                    <Text style={s.entryCompany}>
                      {exp.context} · <Text style={{ color: C.muted, fontWeight: 400 }}>{exp.localisation}</Text>
                    </Text>
                  </View>
                  <Text style={s.datePill}>
                    {exp.dateDebut} – {exp.dateFin || t('Aujourd’hui', 'Present')}
                  </Text>
                </View>

                <Text style={[s.paragraph, { marginTop: 5 }]}>{exp.mission}</Text>

                {((exp.objectives?.length || 0) + (exp.detailsMission?.length || 0)) > 0 && (
                  <View style={{ marginTop: 5 }}>
                    {(exp.objectives || []).slice(0, 3).map((o, idx) => (
                      <Bullet key={`o-${idx}`}>{o}</Bullet>
                    ))}
                    {(exp.detailsMission || []).slice(0, 4).map((d, idx) => (
                      <Bullet key={`d-${idx}`}>{d}</Bullet>
                    ))}
                  </View>
                )}

                <View style={s.chipsRow}>
                  {exp.technologies.map((tech, idx) => (
                    <Chip key={`t-${idx}`} label={tech} />
                  ))}
                  {(exp.outils || []).slice(0, 6).map((outil, idx) => (
                    <Chip key={`u-${idx}`} label={outil} />
                  ))}
                </View>
              </View>
            ))}

            {earlierExperiences.map((exp) => (
              <View key={exp.id} style={s.timelineEntry} wrap={false}>
                <View style={[s.timelineDot, { border: `2 solid ${C.faint}` }]} />
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={[s.entryTitle, { fontSize: 10 }]}>{exp.nomDeMission}</Text>
                    <Text style={[s.entryCompany, { fontSize: 9 }]}>
                      {exp.context} · <Text style={{ color: C.muted, fontWeight: 400 }}>{exp.localisation}</Text>
                    </Text>
                  </View>
                  <Text style={s.datePill}>
                    {exp.dateDebut} – {exp.dateFin || t('Aujourd’hui', 'Present')}
                  </Text>
                </View>
                <Text style={[s.paragraph, { fontSize: 8.5, marginTop: 4 }]}>{exp.mission}</Text>
                <View style={s.chipsRow}>
                  {exp.technologies.slice(0, 8).map((tech, idx) => (
                    <Chip key={idx} label={tech} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ============ SKILLS ============ */}
        <View style={s.section}>
          <SectionHeader eyebrow={t('Savoir-faire', 'Know-how')} title={t('Compétences', 'Skills')} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {data.competenceCategories.slice(0, 2).map((category, catIdx) => (
              <View key={catIdx} style={[s.softCard, { flex: 1 }]} wrap={false}>
                <Text style={[s.cardTitle, { marginBottom: 9 }]}>
                  {[category.title1, category.title2].filter(Boolean).join(' ')}
                </Text>
                {category.competences.map((comp, idx) => (
                  <View key={idx} style={s.skillRow}>
                    <Text style={s.skillLabel}>{comp.label}</Text>
                    <View style={s.barTrack}>
                      <View style={[s.barFill, { width: 104 * (LEVEL_RATIO[comp.level] || 0.5) }]} />
                    </View>
                    <Text style={s.levelText}>{levelLabel(comp.level)}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
          {data.competenceCategories.slice(2).map((category, catIdx) => (
            <View key={catIdx} style={[s.softCard, { marginTop: 8 }]} wrap={false}>
              <Text style={[s.cardTitle, { marginBottom: 6 }]}>
                {[category.title1, category.title2].filter(Boolean).join(' ')}
              </Text>
              <View style={s.chipsRow}>
                {category.competences.map((comp, idx) => (
                  <Chip key={idx} label={comp.label} />
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* ============ EDUCATION ============ */}
        <View style={s.section}>
          <SectionHeader eyebrow={t('Études', 'Studies')} title={t('Formation', 'Education')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {data.formations.map((formation) => (
              <View key={formation.id} style={[s.softCard, { width: '48.6%' }]} wrap={false}>
                <Text style={s.cardTitle}>{formation.nomFormation}</Text>
                <Text style={s.cardSubtitle}>
                  {formation.nomEcole} · {formation.localisation}
                </Text>
                <Text style={[s.dates, { marginTop: 2 }]}>
                  {formation.dateDebut} – {formation.dateFin}
                </Text>
                {(formation.diplomes || []).map((diplome, idx) => (
                  <Text key={idx} style={[s.bullet, { fontSize: 8, marginTop: 3 }]}>
                    {diplome}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* ============ PERSONAL PROJECTS ============ */}
        {data.projetsInternes && data.projetsInternes.length > 0 && (
          <View style={s.section}>
            <SectionHeader
              eyebrow={t('Côté perso', 'Side projects')}
              title={t('Projets personnels', 'Personal Projects')}
            />

            {featuredProjects.map((project) => {
              const techs = getAllTechnologies(project);
              return (
                <View key={project.id} style={s.card} wrap={false}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.cardTitle}>{project.name}</Text>
                      <Text style={[s.dates, { marginTop: 2 }]}>{projectDates(project)}</Text>
                    </View>
                    <StatusBadge status={project.status || 'enCours'} />
                  </View>
                  <Text style={[s.paragraph, { fontSize: 8.5, marginTop: 5 }]}>{project.description}</Text>
                  <View style={s.chipsRow}>
                    {techs.slice(0, 9).map((tech, idx) => (
                      <Chip key={idx} label={tech} />
                    ))}
                  </View>
                </View>
              );
            })}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {otherProjects.map((project) => {
                const techs = getAllTechnologies(project);
                return (
                  <View key={project.id} style={[s.softCard, { width: '48.6%', padding: 10 }]} wrap={false}>
                    <Text style={[s.cardTitle, { fontSize: 9.5 }]}>{project.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <Text style={[s.dates, { fontSize: 7.5, marginRight: 6 }]}>{projectDates(project)}</Text>
                      <StatusBadge status={project.status || 'enCours'} small />
                    </View>
                    <Text style={[s.paragraph, { fontSize: 7.5, lineHeight: 1.4, marginTop: 4 }]}>
                      {project.description}
                    </Text>
                    {techs.length > 0 && (
                      <View style={s.chipsRow}>
                        {techs.slice(0, 4).map((tech, idx) => (
                          <Chip key={idx} label={tech} />
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ============ RECOMMENDATIONS ============ */}
        <View style={s.section}>
          <SectionHeader
            eyebrow={t('Ils m’ont fait confiance', 'They trusted me')}
            title={t('Recommandations professionnelles', 'Professional Recommendations')}
          />
          {data.recommendations.map((rec) => (
            <View key={rec.id} style={s.quoteCard} wrap={false}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{initials(rec.nomPersonne)}</Text>
                </View>
                <View>
                  <Text style={[s.cardTitle, { fontSize: 9.5 }]}>{rec.nomPersonne}</Text>
                  <Text style={{ fontSize: 8, color: C.muted, marginTop: 1 }}>
                    {rec.metier} · {rec.nomEntreprise}
                  </Text>
                </View>
              </View>
              <Text style={s.quoteText}>“{getRecommendationText(rec)}”</Text>
              {rec.liens && (
                <Link src={rec.liens} style={{ fontSize: 7.5, color: C.primary, textDecoration: 'none', marginTop: 4 }}>
                  {rec.liens.replace('https://www.', '')}
                </Link>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
