import { usePDFGenerator } from './usePDFGenerator';
import { PDFDownloadButton } from '../components/PDFDownloadButton';

export const usePDFGeneration = () => {
  const { generatePDF, isGenerating } = usePDFGenerator();
  return {
    generatePDF,
    isGenerating,
    EnhancedPDFButton: PDFDownloadButton,
  };
};
