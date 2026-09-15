import { useState } from 'react';
import { notificationService } from '../services/notificationService';
import useAppStore from '../../store/useAppStore';
import type { CVVariant } from '../components/pdf/EnhancedCVDocument';

/** Generates and downloads the CV as a PDF, in the current language and the chosen variant. */
export const usePDFGenerator = () => {
  const { language, getCVData } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const isFr = language === 'fr';

  const generatePDF = async (variant: CVVariant = 'full') => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      // Lazy-load the PDF renderer so it stays out of the initial bundle
      const [{ pdf }, { EnhancedCVDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../components/pdf/EnhancedCVDocument'),
      ]);

      const year = new Date().getFullYear();
      const filename =
        variant === 'full'
          ? `CV_Remi_Rousseau_${year}_${isFr ? 'complet' : 'full'}.pdf`
          : `CV_Remi_Rousseau_${year}.pdf`;
      const blob = await pdf(
        <EnhancedCVDocument data={getCVData()} language={language} variant={variant} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      notificationService.success(
        `${filename} ${isFr ? 'téléchargé avec succès !' : 'downloaded successfully!'}`
      );
    } catch (error) {
      console.error('PDF generation failed:', error);
      notificationService.error(isFr ? 'Erreur lors de la génération du PDF' : 'PDF generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating, isFr };
};
