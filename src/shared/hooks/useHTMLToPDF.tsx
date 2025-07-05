import React from 'react';
import { FileDown } from 'lucide-react';
import { pdfService, type PDFGenerationOptions } from '../services/pdfService';
import { notificationService } from '../services/notificationService';
import useAppStore from '../../store/useAppStore';

export const useHTMLToPDF = () => {
  const { language } = useAppStore();

  const showDownloadNotification = (fileName: string) => {
    const message = `${fileName} ${language === 'fr' ? 'téléchargé avec succès!' : 'downloaded successfully!'}`;
    notificationService.success(message);
  };

  const generatePDF = async () => {
    try {
      const options: PDFGenerationOptions = {
        type: 'enhanced',
        language,
        filename: `CV_Remi_Rousseau_${new Date().getFullYear()}.pdf`
      };

      await pdfService.generatePDFFromCurrentPage(options);
      
      // Show success notification
      setTimeout(() => {
        showDownloadNotification(options.filename || 'CV_Remi_Rousseau.pdf');
      }, 500);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      const message = language === 'fr' ? 'Erreur lors de la génération du PDF' : 'PDF generation failed';
      notificationService.error(message);
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
    >
      {children || (
        <>
          <FileDown size={18} />
          {language === 'fr' ? 'Télécharger PDF' : 'Download PDF'}
        </>
      )}
    </button>
  );

  return {
    generatePDF,
    EnhancedPDFButton
  };
};