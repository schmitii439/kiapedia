import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import CenturyAccordion from '@/components/CenturyAccordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Import fire level icons
import fireLvl1 from '@assets/fire-level-1.png';
import fireLvl2 from '@assets/fire-level-2.png';
import fireLvl3 from '@assets/fire-level-3.png';
import fireLvl4 from '@assets/fire-level-4.png';
import fireLvl5 from '@assets/fire-level-5.png';
import fireLvl6 from '@assets/fire-level-6.png';
import fireLvl7 from '@assets/fire-level-7.png';
import fireLvl8 from '@assets/fire-level-8.png';
import categoryIcon from '@assets/category.png';

const ConspiracyTheories: React.FC = () => {
  // Fetch all topics for initial statistics
  const { data: topics, isLoading } = useQuery({ 
    queryKey: ['/api/topics']
  });

  // Count topics per century
  const getTopicsCountByCentury = () => {
    if (!topics) return {};
    
    const counts: Record<number, number> = {};
    
    topics.forEach(topic => {
      if (counts[topic.century]) {
        counts[topic.century]++;
      } else {
        counts[topic.century] = 1;
      }
    });
    
    return counts;
  };

  const topicCounts = getTopicsCountByCentury();

  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleNewTopicClick = () => {
    toast({
      title: "Neues Thema erstellen",
      description: "Diese Funktion wird in der nächsten Version implementiert.",
      duration: 3000,
    });
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
    toast({
      title: "Datei-Upload",
      description: "Diese Funktion wird in der nächsten Version implementiert.",
      duration: 3000,
    });
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">Verschwörungstheorien im Kontext</h1>
          <div className="flex space-x-3">
            <Button 
              onClick={handleNewTopicClick}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30 shadow-md"
            >
              <img src={categoryIcon} alt="New" className="w-5 h-5 mr-2" />
              Neues Thema
            </Button>
            <Button 
              onClick={handleUploadClick}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30 shadow-md"
            >
              <img src={fireLvl2} alt="Upload" className="w-5 h-5 mr-2" />
              Upload
            </Button>
          </div>
        </div>
        <p className="text-gray-300">
          Eine historische und kritische Betrachtung von Verschwörungstheorien vom 18. bis 21. Jahrhundert.
        </p>
      </motion.div>
      
      {/* Statistics */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-1">18. Jahrhundert</h3>
              <p className="text-3xl font-bold text-primary-600">{topicCounts[18] || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dokumentierte Theorien</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-1">19. Jahrhundert</h3>
              <p className="text-3xl font-bold text-primary-600">{topicCounts[19] || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dokumentierte Theorien</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-1">20. Jahrhundert</h3>
              <p className="text-3xl font-bold text-primary-600">{topicCounts[20] || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dokumentierte Theorien</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-1">21. Jahrhundert</h3>
              <p className="text-3xl font-bold text-primary-600">{topicCounts[21] || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dokumentierte Theorien</p>
            </div>
          </>
        )}
      </div>
      
      {/* Introduction */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Über diese Sammlung</h2>
        <p className="text-gray-600 mb-4 dark:text-gray-300">
          Diese Datenbank sammelt und analysiert Verschwörungstheorien aus über vier Jahrhunderten.
          Jede Theorie wird kritisch betrachtet, mit historischem Kontext versehen und einer
          faktenbasierten Analyse unterzogen. Unser Ziel ist nicht, zu verurteilen oder zu bestätigen,
          sondern zu verstehen, warum diese Theorien entstanden sind und welche sozialen,
          politischen und psychologischen Faktoren zu ihrer Verbreitung beigetragen haben.
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="material-icons text-primary-600 mr-2">info</span>
          Klicken Sie auf eine Theorie, um detaillierte Informationen zu erhalten.
        </div>
      </div>
      
      {/* Centuries Accordion */}
      <div className="mb-8">
        <CenturyAccordion />
      </div>
      
      {/* Research note */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-start">
          <span className="material-icons text-yellow-500 mr-3">lightbulb</span>
          <div>
            <h3 className="font-medium mb-1">Hinweis zur Forschung</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Die hier präsentierten Informationen dienen ausschließlich Bildungszwecken.
              Unsere Analysen stützen sich auf wissenschaftliche Methoden und
              Faktenprüfung durch mehrere unabhängige Quellen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConspiracyTheories;
