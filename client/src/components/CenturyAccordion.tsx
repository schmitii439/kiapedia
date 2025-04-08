import React, { useState } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import { useQuery } from '@tanstack/react-query';
import { Topic } from '@shared/schema';

const centuries = [
  { id: 18, label: "18. Jahrhundert" },
  { id: 19, label: "19. Jahrhundert" },
  { id: 20, label: "20. Jahrhundert" },
  { id: 21, label: "21. Jahrhundert" }
];

const CenturyAccordion: React.FC = () => {
  const [openCentury, setOpenCentury] = useState<number | null>(null);

  // Function to handle century click
  const handleCenturyClick = (century: number) => {
    if (openCentury === century) {
      // Close current century
      setOpenCentury(null);
    } else {
      // Close previous and open new century
      setOpenCentury(century);
    }
  };

  // Animate content opening/closing
  const animateContent = (element: HTMLElement, isOpening: boolean) => {
    if (isOpening) {
      gsap.fromTo(
        element,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    } else {
      gsap.to(
        element,
        { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" }
      );
    }
  };

  return (
    <div className="accordion-container">
      {centuries.map((century) => (
        <CenturySection 
          key={century.id}
          century={century.id}
          label={century.label}
          isOpen={openCentury === century.id}
          onToggle={handleCenturyClick}
          animateContent={animateContent}
        />
      ))}
    </div>
  );
};

interface CenturySectionProps {
  century: number;
  label: string;
  isOpen: boolean;
  onToggle: (century: number) => void;
  animateContent: (element: HTMLElement, isOpening: boolean) => void;
}

const CenturySection: React.FC<CenturySectionProps> = ({ 
  century, 
  label, 
  isOpen, 
  onToggle,
  animateContent
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Fetch topics for this century
  const { data: topics, isLoading } = useQuery<Topic[]>({ 
    queryKey: [`/api/topics/century/${century}`],
    enabled: isOpen
  });

  // Effect to animate content when isOpen changes
  React.useEffect(() => {
    if (contentRef.current) {
      animateContent(contentRef.current, isOpen);
    }
  }, [isOpen, animateContent]);

  return (
    <div className="century-item mb-2">
      <div 
        className="century-header"
        onClick={() => onToggle(century)}
      >
        <h2 className="text-xl font-semibold">{label}</h2>
        <span 
          className="material-icons transform transition-transform"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </div>
      
      <div 
        ref={contentRef}
        className="century-content overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">
            <span className="material-icons animate-spin mr-2">refresh</span>
            Lade Themen...
          </div>
        ) : topics && topics.length > 0 ? (
          topics.map(topic => (
            <Link key={topic.id} href={`/topic/${topic.id}`}>
              <a className="topic-item">
                <h3 className="font-medium text-lg mb-1">
                  {topic.title} {topic.firstMentionedYear && `(${topic.firstMentionedYear})`}
                </h3>
                {topic.shortDescription && (
                  <p className="text-gray-600 text-sm dark:text-gray-400">{topic.shortDescription}</p>
                )}
              </a>
            </Link>
          ))
        ) : (
          <div className="py-4 text-center text-gray-500">
            Keine Themen für dieses Jahrhundert gefunden.
          </div>
        )}
      </div>
    </div>
  );
};

export default CenturyAccordion;
