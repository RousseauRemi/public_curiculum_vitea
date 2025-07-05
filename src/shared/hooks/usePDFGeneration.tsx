import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import useAppStore from '../../store/useAppStore';

export const usePDFGeneration = () => {
  const { language, getCVData } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      // Lazy-load the PDF renderer so it stays out of the initial bundle
      const [{ pdf }, { EnhancedCVDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../components/pdf/EnhancedCVDocument'),
      ]);

      const filename = `CV_Remi_Rousseau_${new Date().getFullYear()}.pdf`;
      const blob = await pdf(
        <EnhancedCVDocument data={getCVData()} language={language} />
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
        `${filename} ${language === 'fr' ? 'téléchargé avec succès !' : 'downloaded successfully!'}`
      );
    } catch (error) {
      console.error('PDF generation failed:', error);
      notificationService.error(
        language === 'fr' ? 'Erreur lors de la génération du PDF' : 'PDF generation failed'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const EnhancedPDFButton: React.FC<{ className?: string; children?: React.ReactNode }> = ({
    className,
    children
  }) => (
    <button
      onClick={() => generatePDF()}
      className={className}
      type="button"
      disabled={isGenerating}
      aria-busy={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          {language === 'fr' ? 'Génération...' : 'Generating...'}
        </>
      ) : (
        children || (
          <>
            <FileDown size={18} />
            {language === 'fr' ? 'Télécharger PDF' : 'Download PDF'}
          </>
        )
      )}
    </button>
  );

  return {
    generatePDF,
    isGenerating,
    EnhancedPDFButton
  };
};
