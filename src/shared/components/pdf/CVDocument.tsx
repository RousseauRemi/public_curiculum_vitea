import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '../../../store/types';
import { getProjectName, getProjectDisplayDate, getProjectEndDate, getProjectStatus, getAllTechnologies } from '../../utils/projectUtils';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    fontSize: 10,
    color: '#6b7280',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2563eb',
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 3,
  },
  experienceItem: {
    marginBottom: 12,
    pageBreakInside: false,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  experienceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  experienceDate: {
    fontSize: 9,
    color: '#6b7280',
  },
  experienceCompany: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 3,
  },
  experienceDescription: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 4,
  },
  bulletList: {
    marginLeft: 15,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    marginRight: 5,
    color: '#6b7280',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#4b5563',
  },
  techList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    gap: 5,
  },
  techItem: {
    backgroundColor: '#eff6ff',
    padding: '3 6',
    borderRadius: 3,
    fontSize: 8,
    color: '#2563eb',
  },
  skillsSection: {
    marginBottom: 18,
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  skillName: {
    width: '40%',
    fontSize: 10,
    color: '#4b5563',
  },
  skillBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    position: 'relative',
  },
  skillBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 10,
    backgroundColor: '#2563eb',
    borderRadius: 5,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  languageName: {
    fontSize: 10,
    color: '#4b5563',
  },
  languageLevel: {
    fontSize: 9,
    color: '#6b7280',
  },
  hobbyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  hobbyItem: {
    fontSize: 10,
    color: '#4b5563',
  },
  educationItem: {
    marginBottom: 10,
  },
  educationTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  educationDetails: {
    fontSize: 9,
    color: '#6b7280',
  },
  profileDescription: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 10,
  },
  description: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 4,
  },
  objectivesList: {
    fontSize: 9,
    color: '#4b5563',
    marginLeft: 10,
    marginBottom: 2,
  },
  detailsList: {
    fontSize: 9,
    color: '#4b5563',
    marginLeft: 10,
    marginBottom: 2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  skill: {
    backgroundColor: '#eff6ff',
    padding: '2 6',
    borderRadius: 3,
    fontSize: 8,
    color: '#2563eb',
  },
  skillLevel: {
    fontSize: 8,
    color: '#059669',
    fontWeight: 'bold',
  },
  projectItem: {
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  projectDate: {
    fontSize: 8,
    color: '#6b7280',
  },
  projectStatus: {
    fontSize: 8,
    padding: '2 4',
    borderRadius: 3,
  },
  recommendationItem: {
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 5,
    pageBreakInside: false,
  },
  recommendationText: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#4b5563',
    marginBottom: 4,
  },
  recommendationAuthor: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  recommendationPosition: {
    fontSize: 9,
    color: '#6b7280',
  },
  passionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginBottom: 10,
  },
  passion: {
    backgroundColor: '#f0f9ff',
    padding: '2 6',
    borderRadius: 3,
    fontSize: 8,
    color: '#0369a1',
  },
  educationSchool: {
    fontSize: 9,
    color: '#6b7280',
  },
});

export const CVDocument = ({ data, language }: { data: CVData; language: string }) => {
  const isEnglish = language === 'en';
  
  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'termine': return '#10b981';
      case 'enCours': return '#f59e0b';
      case 'demarre': return '#3b82f6';
      case 'archive': return '#6b7280';
      default: return '#8b5cf6';
    }
  };

  const getProjectStatusLabel = (status: string) => {
    if (isEnglish) {
      switch (status) {
        case 'termine': return 'Completed';
        case 'enCours': return 'In Progress';
        case 'demarre': return 'Started';
        case 'archive': return 'Archived';
        default: return status;
      }
    }
    return status;
  };

  const getLevelLabel = (level: string) => {
    if (isEnglish) {
      switch (level) {
        case 'advanced': return 'Advanced';
        case 'intermediate': return 'Intermediate';
        case 'junior': return 'Junior';
        default: return level;
      }
    } else {
      switch (level) {
        case 'advanced': return 'Avancé';
        case 'intermediate': return 'Intermédiaire';
        case 'junior': return 'Junior';
        default: return level;
      }
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {data.personalInfo.prenom} {data.personalInfo.nom}
          </Text>
          <Text style={styles.subtitle}>
            {isEnglish ? 'Fullstack Developer' : 'Développeur Fullstack'}
          </Text>
          <View style={styles.contactInfo}>
            <Text>{data.personalInfo.email}</Text>
            <Text>{data.personalInfo.localisation}</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'About Me' : 'À propos de moi'}
          </Text>
          <Text style={styles.description}>{data.personalInfo.description}</Text>
          
          {/* Passions */}
          <Text style={[styles.sectionTitle, { fontSize: 12, marginTop: 10, marginBottom: 5 }]}>
            {isEnglish ? 'Interests' : 'Centres d\'intérêt'}
          </Text>
          <View style={styles.passionContainer}>
            {data.personalInfo.passions.map((passion, idx) => (
              <Text key={idx} style={styles.passion}>{passion}</Text>
            ))}
          </View>
        </View>

        {/* Experience - First 3 experiences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'Professional Experience' : 'Expérience professionnelle'}
          </Text>
          {data.experiences.slice(0, 3).map((exp) => (
            <View key={exp.id} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceTitle}>{exp.nomDeMission}</Text>
                <Text style={styles.experienceDate}>
                  {exp.dateDebut} - {exp.dateFin || (isEnglish ? 'Present' : 'Présent')}
                </Text>
              </View>
              <Text style={styles.experienceCompany}>{exp.context} - {exp.localisation}</Text>
              <Text style={styles.description}>{exp.mission}</Text>
              
              {/* Objectives */}
              {exp.objectives && exp.objectives.length > 0 && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={[styles.description, { fontWeight: 'bold' }]}>
                    {isEnglish ? 'Key Objectives:' : 'Objectifs principaux :'}
                  </Text>
                  {exp.objectives.map((objective, idx) => (
                    <Text key={idx} style={styles.objectivesList}>• {objective}</Text>
                  ))}
                </View>
              )}
              
              {/* Mission Details */}
              {exp.detailsMission && exp.detailsMission.length > 0 && (
                <View style={{ marginBottom: 4 }}>
                  <Text style={[styles.description, { fontWeight: 'bold' }]}>
                    {isEnglish ? 'Mission Details:' : 'Détails de mission :'}
                  </Text>
                  {exp.detailsMission.map((detail, idx) => (
                    <Text key={idx} style={styles.detailsList}>• {detail}</Text>
                  ))}
                </View>
              )}
              
              {/* Technologies */}
              <View style={{ marginBottom: 4 }}>
                <Text style={[styles.description, { fontWeight: 'bold' }]}>
                  {isEnglish ? 'Technologies:' : 'Technologies :'}
                </Text>
                <View style={styles.skillsContainer}>
                  {exp.technologies.map((tech, idx) => (
                    <Text key={idx} style={styles.skill}>{tech}</Text>
                  ))}
                </View>
              </View>
              
              {/* Tools */}
              {exp.outils && exp.outils.length > 0 && (
                <View>
                  <Text style={[styles.description, { fontWeight: 'bold' }]}>
                    {isEnglish ? 'Tools & Methods:' : 'Outils & Méthodes :'}
                  </Text>
                  <View style={styles.skillsContainer}>
                    {exp.outils.map((outil, idx) => (
                      <Text key={idx} style={[styles.skill, { backgroundColor: '#fef3c7', color: '#92400e' }]}>{outil}</Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </Page>

      {/* Page 2 - Remaining Experiences */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'Professional Experience (continued)' : 'Expérience professionnelle (suite)'}
          </Text>
          {data.experiences.slice(3).map((exp) => (
            <View key={exp.id} style={styles.experienceItem}>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceTitle}>{exp.nomDeMission}</Text>
                <Text style={styles.experienceDate}>
                  {exp.dateDebut} - {exp.dateFin || (isEnglish ? 'Present' : 'Présent')}
                </Text>
              </View>
              <Text style={styles.experienceCompany}>{exp.context} - {exp.localisation}</Text>
              <Text style={styles.description}>{exp.mission}</Text>
              
              <View style={styles.skillsContainer}>
                {exp.technologies.map((tech, idx) => (
                  <Text key={idx} style={styles.skill}>{tech}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'Education' : 'Formation'}
          </Text>
          {data.formations.map((formation) => (
            <View key={formation.id} style={styles.educationItem}>
              <Text style={styles.educationTitle}>{formation.nomFormation}</Text>
              <Text style={styles.educationSchool}>{formation.nomEcole} - {formation.localisation}</Text>
              <Text style={styles.educationDetails}>
                {formation.dateDebut} - {formation.dateFin}
              </Text>
              {formation.diplomes && formation.diplomes.length > 0 && (
                <View style={{ marginTop: 2 }}>
                  {formation.diplomes.map((diplome, idx) => (
                    <Text key={idx} style={styles.description}>• {diplome}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </Page>

      {/* Page 3 - Skills and Projects */}
      <Page size="A4" style={styles.page}>
        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'Technical Skills' : 'Compétences techniques'}
          </Text>
          {data.competenceCategories.map((category, catIdx) => (
            <View key={catIdx} style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 6, color: '#374151' }}>
                {category.title1} {category.title2}
              </Text>
              <View style={styles.skillsContainer}>
                {category.competences.map((comp, idx) => (
                  <View key={idx} style={{ marginBottom: 3 }}>
                    <Text style={styles.skill}>
                      {comp.label} - <Text style={styles.skillLevel}>{getLevelLabel(comp.level)}</Text>
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Projects - First half */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'Personal Projects' : 'Projets personnels'}
          </Text>
          {data.projetsInternes.slice(0, 6).map((project) => {
            const hasSubProjects = project.subProjects && project.subProjects.length > 0;
            const projectDescription = project.description || '';
            const hasDescription = projectDescription.trim().length > 0;
            
            // Check if project has description for conditional rendering
            
            return (
              <View key={project.id} style={[styles.projectItem, { marginBottom: hasSubProjects ? 12 : 6 }]}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{getProjectName(project)}</Text>
                  <Text style={styles.projectDate}>
                    {getProjectDisplayDate(project)} - {getProjectEndDate(project) || (isEnglish ? 'Ongoing' : 'En cours')}
                  </Text>
                </View>
                <Text style={[styles.projectStatus, { 
                  backgroundColor: getProjectStatusColor(getProjectStatus(project)) + '20',
                  color: getProjectStatusColor(getProjectStatus(project)),
                  marginBottom: hasDescription ? 3 : 0
                }]}>
                  {isEnglish ? 'Status: ' : 'Statut: '}{getProjectStatusLabel(getProjectStatus(project))}
                </Text>
                {hasDescription && (
                  <Text style={styles.description}>{projectDescription}</Text>
                )}
                {hasSubProjects && (
                  <View style={{ marginTop: 4 }}>
                    <Text style={[styles.description, { fontWeight: 'bold', fontSize: 8 }]}>
                      {isEnglish ? 'Sub-projects:' : 'Sous-projets :'}
                    </Text>
                    {project.subProjects?.map((subProject, spIdx) => (
                      <View key={spIdx} style={{ marginLeft: 8, marginBottom: 3 }}>
                        <Text style={[styles.description, { fontSize: 8 }]}>
                          • {subProject.name}: {subProject.description}
                        </Text>
                        {subProject.technologies && subProject.technologies.length > 0 && (
                          <View style={[styles.skillsContainer, { marginTop: 2 }]}>
                            {subProject.technologies.map((tech, techIdx) => (
                              <Text key={techIdx} style={[styles.skill, { fontSize: 7 }]}>{tech}</Text>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
                {!hasSubProjects && getAllTechnologies(project).length > 0 && (
                  <View style={styles.skillsContainer}>
                    {getAllTechnologies(project).map((tech, idx) => (
                      <Text key={idx} style={styles.skill}>{tech}</Text>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </Page>

      {/* Page 4 - Remaining Projects and Recommendations */}
      <Page size="A4" style={styles.page}>
        {/* Remaining Projects */}
        {data.projetsInternes.length > 6 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isEnglish ? 'Personal Projects (continued)' : 'Projets personnels (suite)'}
            </Text>
            {data.projetsInternes.slice(6).map((project) => {
              const hasSubProjects = project.subProjects && project.subProjects.length > 0;
              const projectDescription = project.description || '';
              const hasDescription = projectDescription.trim().length > 0;
              
              // Check if project has description for conditional rendering
              
              return (
                <View key={project.id} style={[styles.projectItem, { marginBottom: hasSubProjects ? 12 : 6 }]}>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectTitle}>{getProjectName(project)}</Text>
                    <Text style={styles.projectDate}>
                      {getProjectDisplayDate(project)} - {getProjectEndDate(project) || (isEnglish ? 'Ongoing' : 'En cours')}
                    </Text>
                  </View>
                  <Text style={[styles.projectStatus, { 
                    backgroundColor: getProjectStatusColor(getProjectStatus(project)) + '20',
                    color: getProjectStatusColor(getProjectStatus(project)),
                    marginBottom: hasDescription ? 3 : 0
                  }]}>
                    {isEnglish ? 'Status: ' : 'Statut: '}{getProjectStatusLabel(getProjectStatus(project))}
                  </Text>
                  {hasDescription && (
                    <Text style={styles.description}>{projectDescription}</Text>
                  )}
                  {hasSubProjects && (
                    <View style={{ marginTop: 4 }}>
                      <Text style={[styles.description, { fontWeight: 'bold', fontSize: 8 }]}>
                        {isEnglish ? 'Sub-projects:' : 'Sous-projets :'}
                      </Text>
                      {project.subProjects?.map((subProject, spIdx) => (
                        <View key={spIdx} style={{ marginLeft: 8, marginBottom: 3 }}>
                          <Text style={[styles.description, { fontSize: 8 }]}>
                            • {subProject.name}: {subProject.description}
                          </Text>
                          {subProject.technologies && subProject.technologies.length > 0 && (
                            <View style={[styles.skillsContainer, { marginTop: 2 }]}>
                              {subProject.technologies.map((tech, techIdx) => (
                                <Text key={techIdx} style={[styles.skill, { fontSize: 7 }]}>{tech}</Text>
                              ))}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                  {!hasSubProjects && getAllTechnologies(project).length > 0 && (
                    <View style={styles.skillsContainer}>
                      {getAllTechnologies(project).map((tech, idx) => (
                        <Text key={idx} style={styles.skill}>{tech}</Text>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'Professional Recommendations' : 'Recommandations professionnelles'}
          </Text>
          {data.recommendations.map((rec) => (
            <View key={rec.id} style={styles.recommendationItem}>
              <Text style={styles.recommendationText}>
                "{rec.recommendation}"
              </Text>
              <Text style={styles.recommendationAuthor}>{rec.nomPersonne}</Text>
              <Text style={styles.recommendationPosition}>
                {rec.metier} - {rec.nomEntreprise}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};