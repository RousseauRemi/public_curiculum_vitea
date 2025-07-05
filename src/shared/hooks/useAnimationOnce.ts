import { useState, useEffect, useRef } from 'react';

// Global state to track which elements have been animated
const animatedElements = new Set<string>();

export const useAnimationOnce = (elementId: string) => {
  const [hasAnimated, setHasAnimated] = useState(animatedElements.has(elementId));
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If already animated globally, set states and exit
    if (animatedElements.has(elementId)) {
      setHasAnimated(true);
      setShouldAnimate(false);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedElements.has(elementId)) {
          // Mark as animated globally
          animatedElements.add(elementId);
          
          // Trigger animation
          setShouldAnimate(true);
          
          // After animation completes, mark as static
          setTimeout(() => {
            setHasAnimated(true);
            setShouldAnimate(false);
          }, 1000); // Adjust based on animation duration
          
          // Disconnect observer
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-20px'
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementId]);

  return { 
    ref: elementRef, 
    hasAnimated, 
    shouldAnimate 
  };
};