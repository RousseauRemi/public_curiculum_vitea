import type { Language } from '../../store/types';

export interface PDFGenerationOptions {
  type: 'enhanced';
  language: Language;
  filename?: string;
}

export class PDFService {
  private static instance: PDFService;
  
  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  /**
   * Generate PDF from the current page using browser's print functionality
   * This is a client-side approach that works with the actual rendered components
   */
  public async generatePDFFromCurrentPage(options: PDFGenerationOptions): Promise<void> {
    try {
      
      // Add PDF-specific class to body for CSS targeting
      document.body.classList.add('generating-pdf');
      document.body.classList.add(`pdf-type-${options.type}`);
      
      // Hide elements that shouldn't appear in PDF
      this.togglePDFMode(true);
      
      // Wait longer for DOM updates and animations
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log sections visibility and force them to be visible
      const sections = document.querySelectorAll('section');
      
      // Force all sections to be visible with inline styles
      sections.forEach((section) => {
        const element = section as HTMLElement;
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.position = 'static';
        element.style.transform = 'none';
      });
      
      // Force all animated elements to be visible
      this.forceAnimationsComplete();
      
      // Inject critical PDF styles to ensure sub-projects are visible
      const criticalStyle = document.createElement('style');
      criticalStyle.id = 'pdf-critical-styles';
      criticalStyle.textContent = `
        /* FORCE PDF PROJECT DETAILS TO BE VISIBLE */
        body.generating-pdf .pdf-project-details {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: static !important;
          height: auto !important;
          overflow: visible !important;
          padding: 10px !important;
          margin-top: 10px !important;
        }
        
        /* Override hidden class for PDF details */
        body.generating-pdf .pdf-project-details.hidden {
          display: block !important;
        }
        
        /* Ensure sub-projects are visible with page-break handling */
        body.generating-pdf .sub-project-pdf {
          display: block !important;
          visibility: visible !important;
          padding: 8px !important;
          margin: 5px 0 !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Better page-break handling for project sections */
        body.generating-pdf .project-card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          page-break-after: auto !important;
        }
        
        /* Ensure project modules section stays together */
        body.generating-pdf .pdf-project-details {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Hide web-only elements - BUT keep project descriptions visible */
        body.generating-pdf .line-clamp-2:not(.project-card p),
        body.generating-pdf .line-clamp-3:not(.project-card p),
        body.generating-pdf .voir-plus-button,
        body.generating-pdf .web-only {
          display: none !important;
        }
        
        /* Ensure project descriptions are visible and not clamped in PDF */
        body.generating-pdf .project-card p.line-clamp-2,
        body.generating-pdf .project-card p.line-clamp-3 {
          display: block !important;
          -webkit-line-clamp: unset !important;
          -webkit-box-orient: unset !important;
          overflow: visible !important;
        }
        
        /* Show PDF-specific recommendation content */
        body.generating-pdf .pdf-recommendation-details {
          display: block !important;
          visibility: visible !important;
        }
        
        /* Override hidden class for PDF recommendation details */
        body.generating-pdf .pdf-recommendation-details.hidden {
          display: block !important;
        }
      `;
      document.head.appendChild(criticalStyle);
      
      // Force a reflow to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force a reflow to ensure styles are applied
      const mainContent = document.querySelector('main');
      if (mainContent) {
        // Force reflow
        void mainContent.offsetHeight;
      }
      
      // Use browser's print functionality directly
      window.print();
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    } finally {
      // Restore normal view after a delay to allow print dialog
      setTimeout(() => {
        this.togglePDFMode(false);
        document.body.classList.remove('generating-pdf');
        document.body.classList.remove(`pdf-type-${options.type}`);
        
        // Remove injected styles
        const injectedStyle = document.getElementById('pdf-critical-styles');
        if (injectedStyle) {
          injectedStyle.remove();
        }
        
      }, 2000);
    }
  }


  /**
   * Toggle PDF-specific styling and content visibility
   */
  private togglePDFMode(isPDFMode: boolean): void {
    const elementsToHide = [
      '.scroll-progress-bar',
      '.scroll-to-top',
      '.mobile-menu-toggle',
      '.voir-plus-button',
      '.show-more-btn',
      '.toggle-details',
      '.hover-only',
      'button[aria-label*="menu"]',
      'nav',
      '.navigation'
    ];


    const elementsToShow = [
      '.pdf-only',
      '.expanded-content',
      '.full-details'
    ];

    if (isPDFMode) {
      // Hide interactive elements
      elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el: Element) => {
          (el as HTMLElement).style.display = 'none';
        });
      });


      // Show PDF-specific content
      elementsToShow.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el: Element) => {
          (el as HTMLElement).style.display = 'block';
        });
      });

      // Expand all collapsible content
      this.expandAllContent();

      // Apply PDF-specific styles
      document.body.classList.add('pdf-enhanced');

    } else {
      // Restore original display
      elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el: Element) => {
          (el as HTMLElement).style.display = '';
        });
      });

      elementsToShow.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el: Element) => {
          (el as HTMLElement).style.display = '';
        });
      });

      document.body.classList.remove('pdf-enhanced');
    }
  }

  /**
   * Expand all collapsible content for PDF
   */
  private expandAllContent(): void {
    // Auto-expand experience details by clicking all expand buttons
    const expandButtons = document.querySelectorAll('[data-testid="expand-experience"]');
    expandButtons.forEach(button => {
      if (button instanceof HTMLElement && !button.textContent?.includes('moins')) {
        button.click();
      }
    });

    // Force show all expanded content
    const expandedContent = document.querySelectorAll('.expanded-content, .experience-details, .full-details');
    expandedContent.forEach(content => {
      (content as HTMLElement).style.display = 'block';
      (content as HTMLElement).style.height = 'auto';
      (content as HTMLElement).style.overflow = 'visible';
    });

    // Show all project images
    const imageContainers = document.querySelectorAll('.project-images');
    imageContainers.forEach(container => {
      (container as HTMLElement).style.display = 'block';
    });

    // Expand skill details
    const skillDetails = document.querySelectorAll('.skill-details');
    skillDetails.forEach(detail => {
      (detail as HTMLElement).style.display = 'block';
    });

    // Make sure all sections are visible
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      (section as HTMLElement).style.display = 'block';
      (section as HTMLElement).style.visibility = 'visible';
    });
  }

  /**
   * Force all animations to complete and make content visible
   */
  private forceAnimationsComplete(): void {
    
    // Find all elements with inline styles that might be hiding content
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const style = htmlElement.style;
      
      // Check if element has animation-related inline styles
      if (style.opacity === '0' || 
          style.transform || 
          style.visibility === 'hidden' ||
          style.display === 'none') {
        
        // Force element to be visible
        htmlElement.style.opacity = '1';
        htmlElement.style.transform = 'none';
        htmlElement.style.visibility = 'visible';
        htmlElement.style.transition = 'none';
        htmlElement.style.animation = 'none';
        
        // Only set display if it was explicitly hidden
        if (style.display === 'none' && !htmlElement.classList.contains('print-hidden')) {
          htmlElement.style.display = 'block';
        }
      }
    });
    
    // Also check for Framer Motion specific attributes
    const motionElements = document.querySelectorAll('[data-framer-motion-id]');
    motionElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.opacity = '1';
      htmlElement.style.transform = 'none';
      htmlElement.style.visibility = 'visible';
    });
    
  }


}

export const pdfService = PDFService.getInstance();