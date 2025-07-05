import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { CVData, ProjetInterne } from '../../../store/types';

// Enhanced PDF styles - with visual elements
const enhancedStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#2563eb',
    padding: 20,
    borderRadius: 8,
  },
  headerLeft: {
    flex: 2,
  },
  headerRight: {
    flex: 1,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    border: '3 solid white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#e5e7eb',
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 10,
    color: '#e5e7eb',
    lineHeight: 1.3,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 4,
  },
  skillCategory: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    border: '1 solid #e5e7eb',
  },
  skillCategoryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
    textAlign: 'center',
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderRadius: 4,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  skillName: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
    minWidth: 90,
    marginRight: 12,
  },
  progressBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBg: {
    width: 120,
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    marginRight: 8,
    position: 'relative',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  skillPercentage: {
    fontSize: 8,
    color: '#6b7280',
    fontWeight: 'bold',
    minWidth: 30,
  },
  experienceCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    border: '1 solid #e5e7eb',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  skillLabel: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
    minWidth: 90,
    marginRight: 12,
  },
});

const styles = StyleSheet.create({
  description: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  passion: {
    padding: '3 8',
    borderRadius: 4,
    fontSize: 9,
  },
  experienceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  experienceCompany: {
    fontSize: 10,
    color: '#4b5563',
  },
  experienceDate: {
    fontSize: 9,
    color: '#6b7280',
  },
  skill: {
    padding: '2 6',
    borderRadius: 3,
    fontSize: 8,
  },
});

export const EnhancedCVDocument = ({ data, language }: { data: CVData; language: string }) => {
  const isEnglish = language === 'en';

  // Helper function to resolve image paths for PDF generation
  const resolveImagePath = (imagePath: string): string => {
    // Convert relative paths to absolute URLs for PDF generation
    if (imagePath.startsWith('/')) {
      return `${window.location.origin}${imagePath}`;
    }
    return imagePath;
  };

  // Helper function to get image URL from image object or string
  const getImageUrl = (image: string | { url?: string; type?: string }): string => {
    const url = typeof image === 'string' ? image : image?.url || '';
    return url ? resolveImagePath(url) : '';
  };

  // Helper function to safely render image with error handling
  const renderImage = (src: string, style: unknown, key?: string | number) => {
    if (!src) return null;
    
    try {
      return (
        <Image 
          key={key}
          // @ts-expect-error - PDF style type issue
          style={style}
          src={src}
        />
      );
    } catch {
      // Return placeholder or null if image fails to load
      return null;
    }
  };

  // Helper function for recommendation text display
  const getRecommendationText = (rec: { recommendation: string; translated?: string }): string => {
    // If we're in French and there's a translated field, use it (it's the French translation)
    // If we're in English and there's no translated field, use recommendation (it's in English)
    // If we're in English and there's a translated field, use recommendation (it's the English version)
    // If we're in French and there's no translated field, use recommendation (it's in French)
    
    if (!isEnglish) {
      // French display: prefer translated if available, otherwise use recommendation
      return rec.translated || rec.recommendation;
    } else {
      // English display: use recommendation (which is English), unless translated contains the English version
      return rec.recommendation;
    }
  };

  // Helper functions for project data (matching web implementation)
  const getAllTechnologies = (project: ProjetInterne): string[] => {
    if (project.subProjects && project.subProjects.length > 0) {
      const allTechs = project.subProjects.flatMap((sp) => sp.technologies);
      return [...new Set(allTechs)]; // Remove duplicates
    }
    // Fallback to legacy format
    return project.technologies || [];
  };

  const getProjectName = (project: ProjetInterne): string => {
    return project.name || project.nomProjet || '';
  };

  const getProjectStatus = (project: ProjetInterne): string => {
    return project.status || project.state || 'enCours';
  };

  const getProjectDisplayDate = (project: ProjetInterne): string => {
    // Use new format first
    if (project.startDate) {
      return project.startDate;
    }
    // Fallback to legacy format
    if (project.updates && project.updates.length > 0) {
      return project.updates[0].date;
    }
    return project.dateDebut || '';
  };

  const getProjectEndDate = (project: ProjetInterne): string => {
    return project.endDate || project.dateFin || '';
  };

  // Skill level to percentage mapping
  const getSkillPercentage = (level: string) => {
    switch (level) {
      case 'advanced': return 90;
      case 'intermediate': return 70;
      case 'junior': return 50;
      default: return 60;
    }
  };

  // Technology color mapping
  const getTechColor = (_tech: string, index: number) => {
    const colors = [
      { bg: '#dbeafe', color: '#1e40af' }, // Blue
      { bg: '#dcfce7', color: '#166534' }, // Green
      { bg: '#fef3c7', color: '#92400e' }, // Amber
      { bg: '#fce7f3', color: '#be185d' }, // Pink
      { bg: '#e0e7ff', color: '#3730a3' }, // Indigo
      { bg: '#ecfdf5', color: '#065f46' }, // Emerald
    ];
    return colors[index % colors.length];
  };

  return (
    <Document>
      <Page size="A4" style={enhancedStyles.page}>
        {/* Enhanced Header with Profile Image */}
        <View style={enhancedStyles.header}>
          <View style={enhancedStyles.headerLeft}>
            <Text style={enhancedStyles.name}>
              {data.personalInfo.prenom} {data.personalInfo.nom}
            </Text>
            <Text style={enhancedStyles.subtitle}>
              {isEnglish ? 'Fullstack Developer' : 'Développeur Fullstack'}
            </Text>
            <View style={enhancedStyles.contactInfo}>
              <Text>{data.personalInfo.email}</Text>
              <Text>{data.personalInfo.localisation}</Text>
              <Text>{isEnglish ? `Age: ${data.personalInfo.age}` : `Âge : ${data.personalInfo.age}`}</Text>
            </View>
          </View>
          <View style={enhancedStyles.headerRight}>
            {renderImage(
              resolveImagePath(data.personalInfo.profileImage),
              enhancedStyles.profileImage
            )}
          </View>
        </View>

        {/* About with visual elements */}
        <View style={enhancedStyles.section}>
          <Text style={enhancedStyles.sectionTitle}>
            {isEnglish ? 'About Me' : 'A propos de moi'}
          </Text>
          <Text style={styles.description}>{data.personalInfo.description}</Text>
          
          {/* Interests with icons */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
            {data.personalInfo.passions.map((passion, idx) => (
              <Text key={idx} style={[styles.passion, { backgroundColor: '#dbeafe', color: '#1e40af' }]}>
                {passion}
              </Text>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View style={enhancedStyles.section}>
          <Text style={enhancedStyles.sectionTitle}>
            {isEnglish ? 'Professional Recommendations' : 'Recommandations professionnelles'}
          </Text>
          {data.recommendations.slice(0, 2).map((rec) => (
            <View key={rec.id} style={[enhancedStyles.experienceCard, { marginBottom: 10 }]}>
              <Text style={[styles.description, { fontStyle: 'italic', fontSize: 9, marginBottom: 5 }]}>
                "{getRecommendationText(rec)}"
              </Text>
              <Text style={[styles.experienceTitle, { fontSize: 10 }]}>{rec.nomPersonne}</Text>
              <Text style={[styles.description, { fontSize: 9, color: '#6b7280' }]}>
                {rec.metier} - {rec.nomEntreprise}
              </Text>
            </View>
          ))}
        </View>
      </Page>

      {/* Page 2 - Professional Experience with Full Details */}
      <Page size="A4" style={enhancedStyles.page}>
        <View style={enhancedStyles.section}>
          <Text style={enhancedStyles.sectionTitle}>
            {isEnglish ? 'Professional Experience' : 'Experience professionnelle'}
          </Text>
          {data.experiences.slice(0, 2).map((exp) => (
            <View key={exp.id} style={[enhancedStyles.experienceCard, { marginBottom: 15 }]}>
              {/* Header with logo and info */}
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.experienceTitle, { fontSize: 13, fontWeight: 'bold' }]}>
                    {exp.nomDeMission}
                  </Text>
                  <Text style={[styles.experienceCompany, { color: '#2563eb', fontSize: 11 }]}>
                    {exp.context} - {exp.localisation}
                  </Text>
                  <Text style={[styles.experienceDate, { fontSize: 10 }]}>
                    {exp.dateDebut} - {exp.dateFin || (isEnglish ? 'Present' : 'Present')}
                  </Text>
                </View>
                {exp.logo1 && (
                  <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    {renderImage(
                      resolveImagePath(exp.logo1),
                      { width: 35, height: 35, objectFit: 'contain' }
                    )}
                  </View>
                )}
              </View>
              
              {/* Mission description */}
              <Text style={[styles.description, { marginBottom: 6 }]}>{exp.mission}</Text>
              
              {/* Objectives */}
              {exp.objectives && exp.objectives.length > 0 && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={[styles.description, { fontWeight: 'bold', fontSize: 10 }]}>
                    {isEnglish ? 'Key Objectives:' : 'Objectifs principaux :'}
                  </Text>
                  {exp.objectives.map((objective, idx) => (
                    <Text key={idx} style={[styles.description, { fontSize: 9, paddingLeft: 10 }]}>
                      • {objective}
                    </Text>
                  ))}
                </View>
              )}
              
              {/* Mission Details */}
              {exp.detailsMission && exp.detailsMission.length > 0 && (
                <View style={{ marginBottom: 6 }}>
                  <Text style={[styles.description, { fontWeight: 'bold', fontSize: 10 }]}>
                    {isEnglish ? 'Mission Details:' : 'Détails de mission :'}
                  </Text>
                  {exp.detailsMission.map((detail, idx) => (
                    <Text key={idx} style={[styles.description, { fontSize: 9, paddingLeft: 10 }]}>
                      • {detail}
                    </Text>
                  ))}
                </View>
              )}
              
              {/* Technologies */}
              <View style={{ marginBottom: 4 }}>
                <Text style={[styles.description, { fontWeight: 'bold', fontSize: 10 }]}>
                  {isEnglish ? 'Technologies:' : 'Technologies :'}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginTop: 3 }}>
                  {exp.technologies.map((tech, idx) => {
                    const techColor = getTechColor(tech, idx);
                    return (
                      <Text key={idx} style={[styles.skill, { 
                        backgroundColor: techColor.bg,
                        color: techColor.color,
                        fontSize: 8
                      }]}>
                        {tech}
                      </Text>
                    );
                  })}
                </View>
              </View>
              
              {/* Tools */}
              {exp.outils && exp.outils.length > 0 && (
                <View>
                  <Text style={[styles.description, { fontWeight: 'bold', fontSize: 10 }]}>
                    {isEnglish ? 'Tools & Methods:' : 'Outils & Méthodes :'}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginTop: 3 }}>
                    {exp.outils.map((outil, idx) => (
                      <Text key={idx} style={[styles.skill, { 
                        backgroundColor: '#fef3c7', 
                        color: '#92400e',
                        fontSize: 8
                      }]}>
                        {outil}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </Page>

      {/* Page 2.5 - More Experiences */}
      <Page size="A4" style={enhancedStyles.page}>
        <View style={enhancedStyles.section}>
          <Text style={enhancedStyles.sectionTitle}>
            {isEnglish ? 'Additional Experience' : 'Experience additionnelle'}
          </Text>
          {data.experiences.slice(2, 5).map((exp) => (
            <View key={exp.id} style={[enhancedStyles.experienceCard, { marginBottom: 10 }]}>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.experienceTitle, { fontSize: 11 }]}>
                    {exp.nomDeMission}
                  </Text>
                  <Text style={[styles.experienceCompany, { color: '#2563eb', fontSize: 10 }]}>
                    {exp.context} - {exp.localisation}
                  </Text>
                  <Text style={[styles.experienceDate, { fontSize: 9 }]}>
                    {exp.dateDebut} - {exp.dateFin || (isEnglish ? 'Present' : 'Present')}
                  </Text>
                </View>
                {exp.logo1 && (
                  <View style={{ width: 30, height: 30 }}>
                    {renderImage(
                      resolveImagePath(exp.logo1),
                      { width: 25, height: 25, objectFit: 'contain' }
                    )}
                  </View>
                )}
              </View>
              
              <Text style={[styles.description, { fontSize: 9 }]}>{exp.mission}</Text>
              
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginTop: 5 }}>
                {exp.technologies.slice(0, 6).map((tech, idx) => {
                  const techColor = getTechColor(tech, idx);
                  return (
                    <Text key={idx} style={[styles.skill, { 
                      backgroundColor: techColor.bg,
                      color: techColor.color,
                      fontSize: 7
                    }]}>
                      {tech}
                    </Text>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </Page>

      {/* Page 3 - Skills */}
      <Page size="A4" style={enhancedStyles.page}>
        {/* Technical Skills with Progress Bars */}
        <View style={enhancedStyles.section}>
          <Text style={enhancedStyles.sectionTitle}>
            {isEnglish ? 'Technical Skills' : 'Competences techniques'}
          </Text>
          {data.competenceCategories.slice(0, 2).map((category, catIdx) => (
            <View key={catIdx} style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#374151' }}>
                {category.title1} {category.title2}
              </Text>
              {category.competences.slice(0, 6).map((comp, idx) => {
                const techColor = getTechColor(comp.label, idx);
                return (
                  <View key={idx} style={enhancedStyles.progressBar}>
                    <Text style={enhancedStyles.skillLabel}>{comp.label}</Text>
                    <View style={enhancedStyles.progressBarBg}>
                      <View 
                        style={[
                          enhancedStyles.progressBarFill, 
                          { 
                            width: `${getSkillPercentage(comp.level)}%`,
                            backgroundColor: techColor.color
                          }
                        ]} 
                      />
                    </View>
                    <Text style={{ fontSize: 8, color: '#6b7280', marginLeft: 5 }}>
                      {getSkillPercentage(comp.level)}%
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Additional Skills */}
        <View style={enhancedStyles.section}>
          <Text style={enhancedStyles.sectionTitle}>
            {isEnglish ? 'Additional Skills' : 'Competences additionnelles'}
          </Text>
          {data.competenceCategories.slice(2).map((category, catIdx) => (
            <View key={catIdx} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5, color: '#374151' }}>
                {category.title1} {category.title2}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
                {category.competences.map((comp, idx) => {
                  const techColor = getTechColor(comp.label, idx + catIdx * 10);
                  return (
                    <Text key={idx} style={[styles.skill, { 
                      backgroundColor: techColor.bg,
                      color: techColor.color,
                      fontSize: 8
                    }]}>
                      {comp.label}
                    </Text>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </Page>

      {/* Page 4 - Education and Projects */}
      <Page size="A4" style={enhancedStyles.page}>
        {/* Education */}
        <View style={enhancedStyles.section}>
          <Text style={enhancedStyles.sectionTitle}>
            {isEnglish ? 'Education' : 'Formation'}
          </Text>
          {data.formations.map((formation) => (
            <View key={formation.id} style={enhancedStyles.experienceCard}>
              <Text style={[styles.experienceTitle, { fontSize: 12 }]}>{formation.nomFormation}</Text>
              <Text style={[styles.experienceCompany, { color: '#2563eb' }]}>
                {formation.nomEcole} - {formation.localisation}
              </Text>
              <Text style={styles.experienceDate}>
                {formation.dateDebut} - {formation.dateFin}
              </Text>
              {formation.diplomes && formation.diplomes.length > 0 && (
                <View style={{ marginTop: 5 }}>
                  {formation.diplomes.map((diplome, idx) => (
                    <Text key={idx} style={styles.description}>• {diplome}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Projects with Full Details - Modal Style */}
        {data.projetsInternes && data.projetsInternes.length > 0 && (
          <View style={enhancedStyles.section}>
            <Text style={enhancedStyles.sectionTitle}>
              {isEnglish ? 'Personal Projects' : 'Projets personnels'}
            </Text>
            {data.projetsInternes.slice(0, 2).map((project) => {
            // Get status color
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'termine': return { bg: '#dcfce7', color: '#166534' };
                case 'enCours': return { bg: '#fef3c7', color: '#92400e' };
                case 'demarre': return { bg: '#dbeafe', color: '#1e40af' };
                case 'archive': return { bg: '#f3f4f6', color: '#6b7280' };
                default: return { bg: '#e0e7ff', color: '#3730a3' };
              }
            };
            
            const projectStatus = getProjectStatus(project);
            const statusColor = getStatusColor(projectStatus);
            const statusLabel = isEnglish ? 
              (projectStatus === 'termine' ? 'Completed' : 
               projectStatus === 'enCours' ? 'In Progress' : 
               projectStatus === 'demarre' ? 'Started' : 
               projectStatus === 'archive' ? 'Archived' : projectStatus) 
              : projectStatus;
            
            const projectName = getProjectName(project);
            const displayDate = getProjectDisplayDate(project);
            const endDate = getProjectEndDate(project);
            const allTechnologies = getAllTechnologies(project);
            
            
            return (
              <View key={project.id} style={[enhancedStyles.experienceCard, { marginBottom: 20, padding: 16, border: '3 solid red', backgroundColor: '#ffeb3b' }]} wrap={false}>
                {/* PROJECT HEADER - Modal Style */}
                <View style={{ 
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottom: '2 solid #e2e8f0'
                }}>
                  <Text style={[styles.experienceTitle, { fontSize: 20, fontWeight: 'bold', color: 'red', marginBottom: 10, backgroundColor: 'yellow' }]}>
                    {projectName}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.experienceDate, { fontSize: 11, color: '#6b7280' }]}>
                      📅 {displayDate} - {endDate || (isEnglish ? 'En cours' : 'En cours')}
                    </Text>
                    <Text style={[styles.skill, { 
                      backgroundColor: statusColor.bg,
                      color: statusColor.color,
                      fontSize: 10,
                      padding: '4 10',
                      borderRadius: 12
                    }]}>
                      {statusLabel}
                    </Text>
                  </View>
                </View>
                  
                {/* DESCRIPTION SECTION - Modal Style */}
                <View style={{ marginBottom: 16, border: '2 solid blue', backgroundColor: '#e3f2fd', padding: 8 }}>
                  <Text style={[styles.experienceTitle, { fontSize: 14, fontWeight: 'bold', color: 'blue', marginBottom: 8 }]}>
                    {isEnglish ? 'Description' : 'Description'}
                  </Text>
                  <Text style={[styles.description, { fontSize: 13, lineHeight: 1.5, color: 'darkblue', backgroundColor: 'lightblue' }]}>
                    {project.description}
                  </Text>
                </View>
                
                {/* TECHNOLOGIES SECTION - Modal Style */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={[styles.experienceTitle, { fontSize: 12, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }]}>
                    {isEnglish ? 'Technologies' : 'Technologies'}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                    {allTechnologies.map((tech: string, idx: number) => {
                      const techColor = getTechColor(tech, idx);
                      return (
                        <Text key={idx} style={[styles.skill, { 
                          backgroundColor: techColor.bg,
                          color: techColor.color,
                          fontSize: 9,
                          padding: '4 8',
                          borderRadius: 12
                        }]}>
                          {tech}
                        </Text>
                      );
                    })}
                  </View>
                </View>
                {/* SUB-PROJECTS SECTION - Modal Style */}
                {project.subProjects && project.subProjects.length > 0 && (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={[styles.experienceTitle, { fontSize: 12, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }]}>
                      {isEnglish ? `Sub-Projects (${project.subProjects.length})` : `Sous-projets (${project.subProjects.length})`}
                    </Text>
                    <View style={{ gap: 8 }}>
                      {project.subProjects.slice(0, 3).map((subProject, spIdx) => (
                        <View key={`sub-${spIdx}`} style={{ 
                          padding: 12,
                          backgroundColor: '#f8fafc',
                          border: '1 solid #e2e8f0',
                          borderRadius: 6
                        }}>
                          <Text style={[styles.experienceTitle, { fontSize: 11, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 }]}>
                            {subProject.name}
                          </Text>
                          <Text style={[styles.description, { fontSize: 10, marginBottom: 8, lineHeight: 1.4, color: '#374151' }]}>
                            {subProject.description}
                          </Text>
                          {subProject.technologies && (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
                              {subProject.technologies.map((tech: string, techIdx: number) => {
                                const techColor = getTechColor(tech, techIdx);
                                return (
                                  <Text key={`tech-${techIdx}`} style={[styles.skill, { 
                                    backgroundColor: techColor.bg,
                                    color: techColor.color,
                                    fontSize: 8,
                                    padding: '3 6',
                                    borderRadius: 8
                                  }]}>
                                    {tech}
                                  </Text>
                                );
                              })}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                
                {/* IMAGES SECTION - Modal Style */}
                {(() => {
                  const getAllProjectImages = (project: ProjetInterne) => {
                    let allImages: Array<string | { url?: string; type?: string }> = [];
                    
                    if (project.images && project.images.length > 0) {
                      allImages = [...project.images];
                    }
                    
                    if (project.subProjects && project.subProjects.length > 0) {
                      project.subProjects.forEach((subProject) => {
                        if (subProject.images && subProject.images.length > 0) {
                          allImages = [...allImages, ...subProject.images];
                        }
                      });
                    }
                    
                    return allImages;
                  };
                  
                  const allImages = getAllProjectImages(project);
                  
                  return allImages.length > 0 ? (
                    <View style={{ marginBottom: 8 }}>
                      <Text style={[styles.experienceTitle, { fontSize: 12, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }]}>
                        {isEnglish ? 'Images' : 'Images'}
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {allImages.slice(0, 4).map((image, index) => {
                          const imageUrl = getImageUrl(image);
                          const imageType = typeof image === 'string' ? 'web' : image.type || 'web';
                          
                          return (
                            <View key={index} style={{ 
                              width: index === 0 ? 140 : 90,
                              height: index === 0 ? 90 : 60,
                              position: 'relative'
                            }}>
                              {renderImage(
                                imageUrl,
                                { 
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: 6,
                                  border: '1 solid #e5e7eb'
                                },
                                index
                              )}
                              <Text style={{
                                position: 'absolute',
                                bottom: 3,
                                right: 3,
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                color: 'white',
                                fontSize: 7,
                                padding: '2 4',
                                borderRadius: 3
                              }}>
                                {imageType}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ) : null;
                })()}
              </View>
            );
          })}
        </View>
        )}
      </Page>

      {/* Page 5 - More Projects and Recommendations */}
      <Page size="A4" style={enhancedStyles.page}>
        {/* Additional Projects */}
        {data.projetsInternes && data.projetsInternes.length > 2 && (
          <View style={enhancedStyles.section}>
            <Text style={enhancedStyles.sectionTitle}>
              {isEnglish ? 'Additional Projects' : 'Projets additionnels'}
            </Text>
            {data.projetsInternes.slice(2).map((project) => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'termine': return { bg: '#dcfce7', color: '#166534' };
                  case 'enCours': return { bg: '#fef3c7', color: '#92400e' };
                  case 'demarre': return { bg: '#dbeafe', color: '#1e40af' };
                  case 'archive': return { bg: '#f3f4f6', color: '#6b7280' };
                  default: return { bg: '#e0e7ff', color: '#3730a3' };
                }
              };
              
              const projectStatus = getProjectStatus(project);
              const statusColor = getStatusColor(projectStatus);
              const statusLabel = isEnglish ? 
                (projectStatus === 'termine' ? 'Completed' : 
                 projectStatus === 'enCours' ? 'In Progress' : 
                 projectStatus === 'demarre' ? 'Started' : 
                 projectStatus === 'archive' ? 'Archived' : projectStatus) 
                : projectStatus;
              
              const projectName = getProjectName(project);
              const displayDate = getProjectDisplayDate(project);
              const endDate = getProjectEndDate(project);
              const allTechnologies = getAllTechnologies(project);
              
              return (
                <View key={project.id} style={[enhancedStyles.experienceCard, { marginBottom: 8 }]}>
                  <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.experienceTitle, { fontSize: 11 }]}>
                        {projectName}
                      </Text>
                      <Text style={[styles.experienceDate, { fontSize: 8 }]}>
                        {displayDate} - {endDate || (isEnglish ? 'Ongoing' : 'En cours')}
                      </Text>
                      <Text style={[styles.skill, { 
                        backgroundColor: statusColor.bg,
                        color: statusColor.color,
                        fontSize: 7,
                        padding: '1 4',
                        marginTop: 2
                      }]}>
                        {statusLabel}
                      </Text>
                    </View>
                    
                    {(() => {
                      // Get all images from project and subProjects for additional projects too
                      const getAllProjectImages = (project: ProjetInterne) => {
                        let allImages: Array<string | { url?: string; type?: string }> = [];
                        
                        // Add main project images if they exist
                        if (project.images && project.images.length > 0) {
                          allImages = [...project.images];
                        }
                        
                        // Add subProject images if they exist
                        if (project.subProjects && project.subProjects.length > 0) {
                          project.subProjects.forEach((subProject) => {
                            if (subProject.images && subProject.images.length > 0) {
                              allImages = [...allImages, ...subProject.images];
                            }
                          });
                        }
                        
                        return allImages;
                      };
                      
                      const allImages = getAllProjectImages(project);
                      
                      return allImages.length > 0 ? (
                        <View style={{ width: 80, marginLeft: 6, flexDirection: 'row', gap: 2 }}>
                          {allImages.slice(0, 2).map((image, index) => {
                            const imageUrl = getImageUrl(image);
                            
                            return renderImage(
                              imageUrl,
                              { 
                                width: index === 0 ? 50 : 26,
                                height: 30,
                                objectFit: 'cover',
                                borderRadius: 2,
                                border: '1 solid #e5e7eb',
                              },
                              index
                            );
                          })}
                        </View>
                      ) : null;
                    })()}
                  </View>
                  
                  <Text style={[styles.description, { fontSize: 8, marginBottom: 4 }]}>
                    {project.description}
                  </Text>
                  
                  {/* Show sub-projects count if available */}
                  {project.subProjects && project.subProjects.length > 0 && (
                    <Text style={[styles.description, { fontSize: 7, fontStyle: 'italic', marginBottom: 2 }]}>
                      {isEnglish ? `${project.subProjects.length} sub-projects` : `${project.subProjects.length} sous-projets`}
                    </Text>
                  )}
                  
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                    {allTechnologies.slice(0, 5).map((tech: string, idx: number) => {
                      const techColor = getTechColor(tech, idx);
                      return (
                        <Text key={idx} style={[styles.skill, { 
                          backgroundColor: techColor.bg,
                          color: techColor.color,
                          fontSize: 6,
                          padding: '1 3'
                        }]}>
                          {tech}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* More Recommendations */}
        <View style={enhancedStyles.section}>
          <Text style={enhancedStyles.sectionTitle}>
            {isEnglish ? 'Additional Recommendations' : 'Recommandations additionnelles'}
          </Text>
          {data.recommendations.slice(2).map((rec) => (
            <View key={rec.id} style={[enhancedStyles.experienceCard, { marginBottom: 10 }]}>
              <Text style={[styles.description, { fontStyle: 'italic', fontSize: 9, marginBottom: 5 }]}>
                "{getRecommendationText(rec)}"
              </Text>
              <Text style={[styles.experienceTitle, { fontSize: 10 }]}>{rec.nomPersonne}</Text>
              <Text style={[styles.description, { fontSize: 9, color: '#6b7280' }]}>
                {rec.metier} - {rec.nomEntreprise}
              </Text>
              {rec.liens && (
                <Text style={[styles.description, { fontSize: 8, color: '#2563eb' }]}>
                  {rec.liens}
                </Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};