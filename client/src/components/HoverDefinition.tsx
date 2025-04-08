import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GlossaryTerm } from '@shared/schema';

interface HoverDefinitionProps {
  children: React.ReactNode;
  term: string;
}

const HoverDefinition: React.FC<HoverDefinitionProps> = ({ children, term }) => {
  const [isHovering, setIsHovering] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLSpanElement>(null);

  // Fetch term definition
  const { data: glossaryTerms } = useQuery<GlossaryTerm[]>({ 
    queryKey: ['/api/glossary'],
  });

  const termDefinition = glossaryTerms?.find(
    (glossaryTerm) => glossaryTerm.term.toLowerCase() === term.toLowerCase()
  );

  // Position the tooltip
  useEffect(() => {
    if (isHovering && tooltipRef.current && termRef.current) {
      const termRect = termRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Position tooltip centered below the term
      tooltipRef.current.style.left = `${termRect.left + (termRect.width / 2) - (tooltipRect.width / 2)}px`;
      tooltipRef.current.style.top = `${termRect.bottom + 10}px`;
      
      // Check if tooltip is going off the right edge of the screen
      const rightEdge = termRect.left + (termRect.width / 2) + (tooltipRect.width / 2);
      if (rightEdge > window.innerWidth) {
        tooltipRef.current.style.left = `${window.innerWidth - tooltipRect.width - 10}px`;
      }
      
      // Check if tooltip is going off the left edge of the screen
      const leftEdge = termRect.left + (termRect.width / 2) - (tooltipRect.width / 2);
      if (leftEdge < 10) {
        tooltipRef.current.style.left = '10px';
      }
    }
  }, [isHovering]);

  return (
    <>
      <span
        ref={termRef}
        className="glossary-term"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        data-term={term}
      >
        {children}
      </span>
      
      {isHovering && termDefinition && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 max-w-sm border border-gray-200 dark:border-gray-700"
        >
          <h4 className="font-semibold mb-1">{termDefinition.term}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{termDefinition.definition}</p>
        </div>
      )}
    </>
  );
};

export default HoverDefinition;
