import { Document, Page, Text, View, StyleSheet, Image, Link, Font } from '@react-pdf/renderer';
import type { CVData, ProjetInterne, Recommendation } from '../../../store/types';
import { getTechnologyChipHex } from '../../utils/technologyColors';
import { isCompanyProject, isPersonalProject } from '../../utils/projectUtils';

/** `full`: the whole CV, every project in detail. `professional`: only the projects and sub-projects
 *  flagged `showInProfessionalCV`, in short form, the other internal projects named with a pointer to the website. */
export type CVVariant = 'full' | 'professional';

/** A project or sub-project as shown (in short form) in the professional PDF */
interface ProfessionalEntry {
  key: string;
  title: string;
  dates: string;
  summary: string;
  technologies: string[];
}

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
  soft: '#f8fafc',
  heroInk: '#f8fafc',
  heroMuted: '#cbd5e1',
};

const HERO_HEIGHT = 156;

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
    marginBottom: 30,
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
    marginBottom: 15,
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
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 9,
    lineHeight: 1.5,
    color: C.body,
  },
  // Timeline (experiences)
  timeline: {
    borderLeft: `1.5 solid ${C.border}`,
    marginLeft: 4,
    paddingLeft: 16,
  },
  timelineEntry: {
    marginBottom: 12,
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
    lineHeight: 1.4,
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
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 7,
    marginRight: 4,
    marginBottom: 3.5,
  },
  chipText: {
    fontSize: 7.5,
    fontWeight: 600,
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
  // Skills (keyword groups)
  skillGroup: {
    backgroundColor: C.soft,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    width: '32.3%',
  },
  skillGroupTitle: {
    fontWeight: 700,
    fontSize: 8.5,
    color: C.ink,
    marginBottom: 1,
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
    backgroundColor: '#f1f5f9',
    border: `1 solid ${C.border}`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 8,
    fontWeight: 700,
    color: '#475569',
  },
  quoteText: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: C.body,
    fontStyle: 'italic',
    marginTop: 8,
  },
  translationNote: {
    fontSize: 7,
    color: C.faint,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

const STATUS_COLORS: Record<string, string> = {
  enCours: '#f59e0b',
  termine: '#059669',
  demarre: '#2563eb',
  enReflexion: '#8b5cf6',
  archive: '#94a3b8',
};

const SITE_URL = 'remirousseau.pro';
const SITE_HREF = `https://${SITE_URL}`;

export const EnhancedCVDocument = ({
  data,
  language,
  variant = 'full',
}: {
  data: CVData;
  language: string;
  variant?: CVVariant;
}) => {
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

  // Recommendations: the website shows the original with a translation on demand; the PDF has no
  // toggle, so it shows the text in the document language and says when that text is a translation.
  const getRecommendation = (rec: Recommendation): { text: string; translatedFrom: 'fr' | 'en' | null } => {
    const docLanguage = isEnglish ? 'en' : 'fr';
    const useTranslation = rec.recommendationLanguage
      ? !!rec.translated && rec.recommendationLanguage !== docLanguage
      : !isEnglish && !!rec.translated;
    const raw = useTranslation && rec.translated ? rec.translated : rec.recommendation;
    return {
      text: raw
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        // Blank lines between paragraphs cost a full line each in a narrow card
        .replace(/\n{2,}/g, '\n')
        .trim(),
      translatedFrom: useTranslation ? rec.recommendationLanguage ?? null : null,
    };
  };

  const translationNote = (from: 'fr' | 'en'): string =>
    from === 'fr' ? t('Traduit du français', 'Translated from French') : t('Traduit de l’anglais', 'Translated from English');

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

  // "Depuis 2024" instead of "2024 – en cours": the status pill already says it's ongoing
  const datesLabel = (start: string, end: string | null): string =>
    end ? `${start} – ${end}` : t(`Depuis ${start?.toLowerCase()}`, `Since ${start}`);
  const projectDates = (project: ProjetInterne): string => datesLabel(project.startDate, project.endDate);

  const Chip = ({ label, colors }: { label: string; colors?: { bg: string; text: string } }) => {
    const { bg, text } = colors || getTechnologyChipHex(label);
    return (
      <View style={[s.chip, { backgroundColor: bg }]}>
        <Text style={[s.chipText, { color: text }]}>{label}</Text>
      </View>
    );
  };

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

  // Mission highlights ("atouts") — golden pills so the added value stands out
  const AtoutsRow = ({ atouts, small }: { atouts?: { label: string }[]; small?: boolean }) =>
    atouts && atouts.length > 0 ? (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
        {atouts.map((a, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fef3c7',
              border: '1 solid #fde68a',
              borderRadius: 10,
              paddingVertical: small ? 1.5 : 2,
              paddingHorizontal: 6,
              marginRight: 4,
              marginBottom: 3,
            }}
          >
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#f59e0b', marginRight: 4 }} />
            <Text style={{ fontSize: small ? 7 : 7.5, fontWeight: 600, color: '#92400e' }}>{a.label}</Text>
          </View>
        ))}
      </View>
    ) : null;

  const OwnerPill = ({ personal, small }: { personal?: boolean; small?: boolean }) => (
    <View
      style={{
        backgroundColor: personal ? '#ffe4e6' : '#dbeafe',
        borderRadius: 8,
        paddingVertical: small ? 1 : 1.5,
        paddingHorizontal: 5,
        marginRight: 5,
      }}
    >
      <Text style={{ fontSize: small ? 6.5 : 7, fontWeight: 600, color: personal ? '#be123c' : '#1d4ed8' }}>
        {personal ? t('Perso', 'Personal') : t('Entreprise', 'Company')}
      </Text>
    </View>
  );

  // Company, personal, or both
  const OwnerPills = ({ project, small }: { project: ProjetInterne; small?: boolean }) => (
    <>
      {isCompanyProject(project) && <OwnerPill small={small} />}
      {isPersonalProject(project) && <OwnerPill personal small={small} />}
    </>
  );

  const FeaturedProject = ({ project }: { project: ProjetInterne }) => (
    <View style={s.card} wrap={false}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardTitle}>{project.name}</Text>
          <Text style={[s.dates, { marginTop: 2 }]}>{projectDates(project)}</Text>
        </View>
        <OwnerPills project={project} />
        <StatusBadge status={project.status || 'enCours'} />
      </View>
      <Text style={[s.paragraph, { fontSize: 8.5, marginTop: 5 }]}>{project.description}</Text>
      <View style={s.chipsRow}>
        {getAllTechnologies(project).slice(0, 9).map((tech, idx) => (
          <Chip key={idx} label={tech} />
        ))}
      </View>
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
  const projects = variant === 'full' ? data.projetsInternes || [] : [];
  // Professional variant: the flagged projects and sub-projects in short form, the other internal
  // projects only named ("EstimateImmo — Real Estate Estimation" → "EstimateImmo")
  const shortName = (project: ProjetInterne): string => project.name.split(/ — | \(/)[0].trim();
  const hasFlaggedSubProject = (project: ProjetInterne): boolean =>
    !!project.subProjects?.some((sub) => sub.showInProfessionalCV);
  const professionalEntries: ProfessionalEntry[] =
    variant === 'professional'
      ? (data.projetsInternes || []).flatMap((project) => [
          ...(project.showInProfessionalCV
            ? [{
                key: `p-${project.id}`,
                title: shortName(project),
                dates: datesLabel(project.startDate, project.endDate),
                summary: project.summary || project.description,
                technologies: getAllTechnologies(project),
              }]
            : []),
          ...(project.subProjects || [])
            .filter((sub) => sub.showInProfessionalCV)
            .map((sub) => ({
              key: `s-${project.id}-${sub.id}`,
              title: sub.name,
              dates: datesLabel(sub.startDate, sub.endDate),
              summary: sub.summary || sub.description,
              technologies: sub.technologies || [],
            })),
        ])
      : [];
  // The other internal projects: just the name and a few technologies
  const otherInternalProjects =
    variant === 'professional'
      ? (data.projetsInternes || [])
          .filter(
            (project) => isCompanyProject(project) && !project.showInProfessionalCV && !hasFlaggedSubProject(project)
          )
          .map((project) => ({ id: project.id, name: shortName(project), technologies: getAllTechnologies(project).slice(0, 3) }))
      : [];
  const featuredProjects = projects.slice(0, 4);
  const otherProjects = projects.slice(4);

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
            <Text style={s.role}>{t('Développeur .NET Fullstack', 'Full-Stack .NET Developer')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
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
              <Chip key={idx} label={passion} colors={{ bg: '#ccfbf1', text: '#0f766e' }} />
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
                <AtoutsRow atouts={exp.atouts} />

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
                <AtoutsRow atouts={exp.atouts} small />
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

        {/* ============ COMPANY PROJECTS (professional variant, short form, right after the career) ============ */}
        {professionalEntries.length > 0 && (
          <View style={s.section} wrap={false}>
            <SectionHeader eyebrow={t('Entreprise', 'Company')} title={t('Projets de l’entreprise', 'Company Projects')} />
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {professionalEntries.map((entry) => (
                <View key={entry.key} style={[s.softCard, { flex: 1, paddingVertical: 9, paddingHorizontal: 10 }]}>
                  <Text style={[s.cardTitle, { fontSize: 9.5 }]}>{entry.title}</Text>
                  <Text style={[s.dates, { fontSize: 7.5, marginTop: 1 }]}>{entry.dates}</Text>
                  <Text style={[s.paragraph, { fontSize: 7.5, lineHeight: 1.4, marginTop: 4 }]}>{entry.summary}</Text>
                  <View style={[s.chipsRow, { marginTop: 5 }]}>
                    {entry.technologies.slice(0, 3).map((tech, idx) => (
                      <Chip key={idx} label={tech} />
                    ))}
                  </View>
                </View>
              ))}
            </View>
            {otherInternalProjects.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 8, color: C.muted, marginBottom: 3 }}>
                  <Text style={{ fontWeight: 700, color: C.ink }}>{t('Autres projets internes', 'Other internal projects')}</Text>
                  {t(' · détails et captures sur ', ' · details and screenshots on ')}
                  <Link src={isEnglish ? SITE_HREF : `${SITE_HREF}/fr/`} style={{ color: C.primary, textDecoration: 'none' }}>
                    {SITE_URL}
                  </Link>
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {otherInternalProjects.map((project) => (
                    <View key={project.id} style={{ width: '50%', paddingRight: 8, marginBottom: 1 }}>
                      <Text style={{ fontSize: 7.5, lineHeight: 1.3, color: C.body }}>
                        <Text style={{ fontWeight: 600, color: C.ink }}>{project.name}</Text>
                        {project.technologies.length > 0 ? `  —  ${project.technologies.join(', ')}` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* ============ SKILLS ============ */}
        {/* Unbreakable with its title, like Education: the title alone at a page bottom otherwise */}
        <View style={s.section} wrap={false}>
          <SectionHeader eyebrow={t('Savoir-faire', 'Know-how')} title={t('Compétences', 'Skills')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }} wrap={false}>
            {(data.skillGroups?.length
              ? data.skillGroups
              : data.competenceCategories.map((category) => ({
                  title: [category.title1, category.title2].filter(Boolean).join(' '),
                  items: category.competences.map((comp) => comp.label),
                }))
            ).map((group, idx) => (
              <View key={idx} style={s.skillGroup}>
                <Text style={s.skillGroupTitle}>{group.title}</Text>
                <View style={[s.chipsRow, { marginTop: 4 }]}>
                  {group.items.map((item, itemIdx) => (
                    <Chip key={itemIdx} label={item} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ============ EDUCATION ============ */}
        <View style={s.section} wrap={false}>
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
        {projects.length > 0 && (
          <View style={s.section}>
            {/* The title travels with the first card: on its own it could end up alone at the
                bottom of a page (minPresenceAhead does not account for an unbreakable card) */}
            <View wrap={false}>
              <SectionHeader
                eyebrow={t('Entreprise & perso', 'Company & personal')}
                title={t('Projets internes & personnels', 'Internal & Personal Projects')}
              />
              {featuredProjects.slice(0, 1).map((project) => (
                <FeaturedProject key={project.id} project={project} />
              ))}
            </View>

            {featuredProjects.slice(1).map((project) => (
              <FeaturedProject key={project.id} project={project} />
            ))}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {otherProjects.map((project) => {
                const techs = getAllTechnologies(project);
                return (
                  <View key={project.id} style={[s.softCard, { width: '48.6%', padding: 10 }]} wrap={false}>
                    <Text style={[s.cardTitle, { fontSize: 9.5 }]}>{project.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <Text style={[s.dates, { fontSize: 7.5, marginRight: 6 }]}>{projectDates(project)}</Text>
                      <OwnerPills project={project} small />
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
        {/* Full CV: on their own page, since flowing after the project cards left the longest quote
            alone on a last page. Professional CV: they follow the short project section. */}
        <View style={s.section} break={variant === 'full'}>
          {data.recommendations.map((rec, index) => {
            const { text, translatedFrom } = getRecommendation(rec);
            const card = (
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
                <Text style={s.quoteText}>“{text}”</Text>
                {translatedFrom && <Text style={s.translationNote}>{translationNote(translatedFrom)}</Text>}
                {rec.liens && (
                  <Link src={rec.liens} style={{ fontSize: 7.5, color: C.primary, textDecoration: 'none', marginTop: 4 }}>
                    {rec.liens.replace('https://www.', '')}
                  </Link>
                )}
              </View>
            );
            // The title travels with the first recommendation so it never sits alone at a page bottom
            return index === 0 ? (
              <View key={rec.id} wrap={false}>
                <SectionHeader
                  eyebrow={t('Ils m’ont fait confiance', 'They trusted me')}
                  title={t('Recommandations professionnelles', 'Professional Recommendations')}
                />
                {card}
              </View>
            ) : (
              card
            );
          })}
        </View>
      </Page>
    </Document>
  );
};
