import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, FileDown, Loader2 } from 'lucide-react';
import { usePDFGenerator } from '../hooks/usePDFGenerator';
import type { CVVariant } from './pdf/EnhancedCVDocument';

interface PDFDownloadButtonProps {
  className?: string;
  /** Classes for the wrapper, e.g. `w-full` when the button stretches to its container */
  wrapperClassName?: string;
  children?: React.ReactNode;
}

/**
 * Download button offering two PDFs: the professional CV (key projects only) and the full CV.
 *
 * Declared at module level, not inside the hook: a component created during render gets a new
 * identity on every parent render, which would remount it and close the menu whenever the
 * navigation re-renders on scroll. The menu is portalled with fixed positioning because the hero
 * and contact sections clip their overflow.
 */
export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ className, wrapperClassName, children }) => {
  const { generatePDF, isGenerating, isFr } = usePDFGenerator();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; above: boolean } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  // Place the menu under the button, or above it when the viewport has no room below
  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? 150;
    const above = window.innerHeight - rect.bottom < menuHeight + 16 && rect.top > menuHeight + 16;
    setPosition({
      top: above ? rect.top - 8 : rect.bottom + 8,
      left: rect.left + rect.width / 2,
      above,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    // The menu is fixed to where the button was: close it rather than let it drift on scroll
    const onScrollOrResize = () => close();

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open, close]);

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === 'ArrowDown' ? (current + 1) % items.length : (current - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  const choose = (variant: CVVariant) => {
    close(true);
    void generatePDF(variant);
  };

  const options: { variant: CVVariant; title: string; description: string }[] = [
    {
      variant: 'professional',
      title: isFr ? 'CV professionnel' : 'Professional CV',
      description: isFr ? 'Expériences, compétences, recommandations et projets clés' : 'Experience, skills, recommendations and key projects',
    },
    {
      variant: 'full',
      title: isFr ? 'CV complet' : 'Full CV',
      description: isFr ? 'Inclut aussi les projets internes et personnels' : 'Also includes internal and personal projects',
    },
  ];

  return (
    <div className={`relative inline-flex ${wrapperClassName ?? ''}`}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((value) => !value)}
        className={className}
        type="button"
        disabled={isGenerating}
        aria-busy={isGenerating}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
      >
        {isGenerating ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {isFr ? 'Génération...' : 'Generating...'}
          </>
        ) : (
          <>
            {children || (
              <>
                <FileDown size={18} />
                {isFr ? 'Télécharger PDF' : 'Download PDF'}
              </>
            )}
            <ChevronDown
              size={14}
              aria-hidden="true"
              className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={isFr ? 'Choisir le CV à télécharger' : 'Choose the CV to download'}
            onKeyDown={onMenuKeyDown}
            style={{
              position: 'fixed',
              top: position?.top ?? -9999,
              left: position?.left ?? -9999,
              transform: `translate(-50%, ${position?.above ? '-100%' : '0'})`,
            }}
            className="z-[10000] w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-secondary-200 bg-white p-1.5 text-left shadow-xl dark:border-slate-700 dark:bg-slate-800"
          >
            {options.map((option) => (
              <button
                key={option.variant}
                type="button"
                role="menuitem"
                onClick={() => choose(option.variant)}
                className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary-50 focus:bg-secondary-50 focus:outline-none dark:hover:bg-slate-700 dark:focus:bg-slate-700"
              >
                <FileDown size={16} className="mt-0.5 flex-shrink-0 text-primary-600" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold text-neutral-900 dark:text-slate-100">{option.title}</span>
                  <span className="block text-xs text-neutral-500 dark:text-slate-400">{option.description}</span>
                </span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};
