// Core data types for the CV application

export interface ExperienceAtout {
  /** Icon key: english | ai | newtech | fullapp | industry | critical */
  icon: string;
  label: string;
  description: string;
}

export interface Experience {
  id: number;
  nomDeMission: string;
  localisation: string;
  dateDebut: string;
  /** null when the mission is still running (rendered as "Présent" / "Present") */
  dateFin: string | null;
  missionEnCours: boolean;
  technologies: string[];
  outils: string[];
  mission: string;
  objectives: string[];
  context: string;
  detailsMission: string[];
  conditionDeFinDeMission: string;
  equipe: string;
  logo1: string;
  logo2?: string;
  atouts?: ExperienceAtout[];
}

export interface Competence {
  label: string;
  backgroundColor: string;
  data: number; // 1-3 skill level
  level: SkillLevel;
  description: string;
}

export interface CompetenceCategory {
  title1: string;
  title2: string;
  competences: Competence[];
}

export interface Formation {
  id: number;
  nomFormation: string;
  nomEcole: string;
  localisation: string;
  dateDebut: string;
  dateFin: string;
  image: string;
  diplomes: string[];
}

export interface ProjectUpdate {
  date: string;
  description: string;
}

export interface ProjectImage {
  url: string;
  type: 'web' | 'mobile' | 'photo';
}

export interface SubProject {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  description: string;
  technologies: string[];
  tools: string[];
  updates: ProjectUpdate[];
  images?: (string | ProjectImage)[];
  /** One-sentence version of `description`, for the professional PDF */
  summary?: string;
  /** Shown in the professional PDF on its own, like a project (see ProjetInterne.showInProfessionalCV) */
  showInProfessionalCV?: boolean;
}

export interface ProjetInterne {
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  status: ProjectState;
  /** ISO "YYYY-MM" of the latest activity — drives newest-first sorting */
  sortDate?: string;
  /** True for personal/hobby projects (vs internal company projects) */
  personal?: boolean;
  /** With `personal: true`, marks a project that is both personal and a company project.
   *  Use isPersonalProject / isCompanyProject (projectUtils) rather than reading the flags. */
  company?: boolean;
  /** One-sentence version of `description`, for the professional PDF */
  summary?: string;
  /** Company project shown (in short form) in the professional PDF, which only names the other internal projects */
  showInProfessionalCV?: boolean;
  expandable?: boolean;
  subProjects?: SubProject[];
  category?: ProjectCategory;
  categories?: ProjectCategory[];
  description: string;
  images?: (string | ProjectImage)[];
  // Legacy fields - kept for PDF compatibility (deprecated)
  nomProjet?: string;
  dateDebut?: string;
  dateFin?: string;
  state?: ProjectState;
  technologies?: string[];
  outils?: string[];
  updates?: ProjectUpdate[];
}

export interface Recommendation {
  id: number;
  nomEntreprise: string;
  nomPersonne: string;
  metier: string;
  liens: string;
  recommendation: string;
  translated?: string;
  /** Language of `recommendation` (the original text), so the PDF can tell a translation apart */
  recommendationLanguage?: 'fr' | 'en';
  logo1: string;
}

export interface Language_ {
  label: string;
  level: string;
}

export interface PersonalInfo {
  nom: string;
  prenom: string;
  /** Working status shown next to the title, e.g. "Freelance" */
  statut?: string;
  langues?: Language_[];
  localisation: string;
  telephone?: string;
  email: string;
  linkedin: string;
  github?: string;
  website?: string;
  profileImage: string;
  description: string;
  passions: string[];
  availabilityStatus: AvailabilityStatus;
}

// Enums as const objects for better TypeScript compatibility
export const SkillLevel = {
  JUNIOR: 'junior',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const;

export const AvailabilityStatus = {
  AVAILABLE_FREE: 'available-free',
  IN_MISSION_OPEN: 'in-mission-open'
} as const;

export const ProjectState = {
  EN_REFLEXION: 'enReflexion',
  DEMARRE: 'demarre',
  EN_COURS: 'enCours',
  TERMINE: 'termine',
  ARCHIVE: 'archive'
} as const;

export const ProjectCategory = {
  INFORMATICS: 'informatics',
  GARDENING: 'gardening',
  WOOD: 'wood',
  ELECTRONICS: 'electronics'
} as const;

export const Language = {
  FR: 'fr',
  EN: 'en'
} as const;


export type SkillLevel = typeof SkillLevel[keyof typeof SkillLevel];
export type ProjectState = typeof ProjectState[keyof typeof ProjectState];
export type ProjectCategory = typeof ProjectCategory[keyof typeof ProjectCategory];
export type Language = typeof Language[keyof typeof Language];
export type AvailabilityStatus = typeof AvailabilityStatus[keyof typeof AvailabilityStatus];

// Application state interfaces
export interface AppState {
  language: Language;
  activeSection: string;
  isMobileMenuOpen: boolean;
  isHydrated: boolean;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  competenceCategories: CompetenceCategory[];
  /** Skills grouped by area, shown as keyword lists in the PDF */
  skillGroups?: SkillGroup[];
  formations: Formation[];
  projetsInternes: ProjetInterne[];
  recommendations: Recommendation[];
}