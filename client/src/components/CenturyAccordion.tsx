import React, { useState } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Topic } from '@shared/schema';
import { Badge } from '@/components/ui/badge';

// Import fire level icons for truth indicators
import fireLvl1 from '@assets/fire-level-1.png';
import fireLvl3 from '@assets/fire-level-3.png';
import fireLvl8 from '@assets/fire-level-8.png';

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
    <div className="century-item mb-4">
      <motion.div 
        className="century-header bg-gray-800/80 border border-cyan-600/30 rounded-lg p-4 cursor-pointer flex justify-between items-center hover:bg-gray-700/80 transition-colors backdrop-blur-md shadow-lg"
        onClick={() => onToggle(century)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <h2 className="text-xl font-semibold text-white">{label}</h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <img src={fireLvl3} alt="Expand" className="w-6 h-6" />
        </motion.div>
      </motion.div>
      
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
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href={`/topic/${topic.id}`}>
                <a className="topic-item bg-gray-800/60 border border-cyan-500/20 rounded-lg p-4 mb-4 block hover:bg-gray-700/60 transition-colors shadow-lg backdrop-blur-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg mb-1 text-white">
                        {topic.title} {topic.firstMentionedYear && `(${topic.firstMentionedYear})`}
                      </h3>
                      {topic.shortDescription && (
                        <p className="text-gray-300 text-sm">{topic.shortDescription}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {/* Truth indicators - randomly assign for now (would be based on real data) */}
                      {topic.id % 3 === 0 ? (
                        <Badge variant="outline" className="bg-green-900/30 border-green-500/30 text-white flex items-center gap-1 px-2">
                          <img src={fireLvl1} alt="True" className="w-4 h-4" /> Wahr
                        </Badge>
                      ) : topic.id % 3 === 1 ? (
                        <Badge variant="outline" className="bg-yellow-900/30 border-yellow-500/30 text-white flex items-center gap-1 px-2">
                          <img src={fireLvl3} alt="Neutral" className="w-4 h-4" /> Unbestätigt
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-900/30 border-red-500/30 text-white flex items-center gap-1 px-2">
                          <img src={fireLvl8} alt="False" className="w-4 h-4" /> Widerlegt
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className="text-cyan-400 text-xs font-medium">Mehr erfahren →</span>
                  </div>
                </a>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="py-4 text-center text-gray-300">
            Keine Themen für dieses Jahrhundert gefunden.
          </div>
        )}
      </div>
    </div>
  );
};

export default CenturyAccordion;
