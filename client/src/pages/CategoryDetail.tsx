import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FiFilter } from 'react-icons/fi';
import { TbExclamationMark } from 'react-icons/tb';

// Import images
import backIcon from '@assets/back.png';
import fireLvl1 from '@assets/fire-level-1.png';
import fireLvl3 from '@assets/fire-level-3.png';
import fireLvl5 from '@assets/fire-level-5.png';
import fireLvl8 from '@assets/fire-level-8.png';
import geoEngineeringImg from '@assets/DALL·E 2025-04-08 05.11.19 - A subtle, realistic photomontage designed for a website background, illustrating the concept of geo-engineering without text. The image features a wid.webp';

// Define verschwörungsKategorien directly in this component
const verschwörungsKategorien = [
  {
    id: 1,
    title: "Geo-Engineering",
    image: geoEngineeringImg,
    description: "Verschwörungstheorien rund um gezielte großflächige Eingriffe in geochemische Kreisläufe der Erde.",
    topics: [
      { id: 101, title: "Chemtrails", year: 1996, description: "Theorie über angebliche chemische Zusätze in Flugzeugabgasen zur Wetterveränderung oder Bevölkerungskontrolle.", truthRating: 5 },
      { id: 102, title: "Sonnenspiegel", year: 2010, description: "Behauptung, dass riesige Spiegel im Weltall installiert werden, um Sonnenlicht zurück ins All zu reflektieren.", truthRating: 7 },
      { id: 103, title: "Wetterkontrolle", year: 1953, description: "Verschwörungstheorie über staatliche Programme zur künstlichen Kontrolle von Wetterphänomenen.", truthRating: 6 },
      { id: 104, title: "Stratosphärische Aerosolinjektion", year: 2022, description: "Hypothetisches Verfahren, bei dem Schwefeldioxid in die obere Atmosphäre eingebracht wird, um die globale Erwärmung abzumildern.", truthRating: 0 }
    ]
  },
  {
    id: 2,
    title: "Geheimgesellschaften",
    description: "Theorien über angebliche geheime Organisationen, die im Verborgenen die Weltgeschicke lenken.",
    topics: [
      { id: 201, title: "Illuminati", year: 1776, description: "Behauptungen über eine geheime Elite, die im Verborgenen die Weltpolitik steuert.", truthRating: 2 },
      { id: 202, title: "Freimaurer", year: 1717, description: "Verschwörungstheorien über den angeblichen globalen Einfluss der Freimaurerlogen.", truthRating: 4 },
      { id: 203, title: "Bilderberg-Gruppe", year: 1954, description: "Theorie über einen angeblichen geheimen Weltrat aus Wirtschafts- und Politikeliten.", truthRating: 7 },
      { id: 204, title: "Globale Schattenregierung", year: 2000, description: "Angebliches Netzwerk mächtiger Individuen und Organisationen, die heimlich die Geschicke der Welt lenken.", truthRating: 0 }
    ]
  },
  {
    id: 3,
    title: "Technologie-Verschwörungen",
    description: "Verschwörungstheorien im Zusammenhang mit modernen Technologien und deren angeblichen versteckten Zwecken.",
    topics: [
      { id: 301, title: "5G und Gesundheit", year: 2018, description: "Verschwörungstheorie über angebliche gesundheitsschädliche Wirkungen von 5G-Mobilfunktechnologie.", truthRating: 1 },
      { id: 302, title: "RFID-Chips", year: 2005, description: "Behauptungen über Pläne zur Zwangsimplantierung von Funkchips zur Überwachung der Bevölkerung.", truthRating: 2 },
      { id: 303, title: "Künstliche Intelligenz", year: 2010, description: "Theorien über KI-Systeme, die angeblich heimlich die Kontrolle übernehmen sollen.", truthRating: 3 },
      { id: 304, title: "Quantencomputer-Manipulation", year: 2023, description: "Theorie, dass Quantencomputer in der Lage sind, die Realität zu manipulieren und alternative Zeitlinien zu erschaffen.", truthRating: 0 }
    ]
  },
  {
    id: 4,
    title: "Politische Verschwörungen",
    description: "Verschwörungstheorien zu angeblichen geheimen politischen Machenschaften und Manipulationen.",
    topics: [
      { id: 401, title: "Deep State", year: 1960, description: "Theorie über einen angeblichen 'Staat im Staate', der unabhängig von demokratischen Prozessen agiert.", truthRating: 5 },
      { id: 402, title: "Wahlmanipulation", year: 1876, description: "Verschwörungstheorien über systematische Wahlfälschungen in demokratischen Staaten.", truthRating: 4 },
      { id: 403, title: "False Flag Operationen", year: 1898, description: "Behauptungen, dass Regierungen heimlich Terroranschläge inszenieren, um politische Ziele zu erreichen.", truthRating: 2 },
      { id: 404, title: "Gedankenkontrolle durch Medien", year: 2015, description: "Hypothese, dass Massenmedien systematisch für soziale Programmierung und Meinungsmanipulation eingesetzt werden.", truthRating: 0 }
    ]
  }
];

const CategoryDetail: React.FC = () => {
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const categoryId = parseInt(params.id);
  
  // Get category data
  const category = verschwörungsKategorien.find(cat => cat.id === categoryId);
  
  // Filter options
  const [sortOption, setSortOption] = useState<string>('year');
  const [filterTruth, setFilterTruth] = useState<string>('all');
  
  if (!category) {
    return (
      <div className="py-8 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 dark:bg-gray-800 dark:border-gray-700 text-center">
          <span className="material-icons text-4xl text-gray-400 mb-4">error_outline</span>
          <h1 className="text-2xl font-semibold mb-2">Kategorie nicht gefunden</h1>
          <p className="text-gray-600 mb-6 dark:text-gray-300">Die von Ihnen gesuchte Kategorie existiert nicht oder wurde gelöscht.</p>
          <Link href="/categories" className="text-primary-600 hover:underline font-medium">
            Zurück zur Kategorien-Übersicht
          </Link>
        </div>
      </div>
    );
  }
  
  // Sort and filter topics
  const getSortedAndFilteredTopics = () => {
    let filteredTopics = [...category.topics];
    
    // Apply truth rating filter
    if (filterTruth !== 'all') {
      const ratingThreshold = parseInt(filterTruth);
      filteredTopics = filteredTopics.filter(topic => {
        if (filterTruth === 'confirmed') return topic.truthRating >= 7;
        if (filterTruth === 'debunked') return topic.truthRating <= 3;
        if (filterTruth === 'controversial') return topic.truthRating > 3 && topic.truthRating < 7;
        if (filterTruth === 'unconfirmed') return topic.truthRating === 0;
        return true;
      });
    }
    
    // Apply sorting
    if (sortOption === 'year') {
      filteredTopics.sort((a, b) => a.year - b.year);
    } else if (sortOption === 'name') {
      filteredTopics.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'truth') {
      filteredTopics.sort((a, b) => b.truthRating - a.truthRating);
    }
    
    return filteredTopics;
  };
  
  const sortedAndFilteredTopics = getSortedAndFilteredTopics();
  
  const renderFireLevel = (rating: number) => {
    if (rating === 0) return { icon: fireLvl5, text: "Nichts bestätigt", className: "bg-gray-800/50 border-gray-500/30" };
    if (rating >= 7) return { icon: fireLvl1, text: "Bestätigt", className: "bg-green-900/30 border-green-500/30" };
    if (rating >= 4 && rating <= 6) return { icon: fireLvl3, text: "Umstritten", className: "bg-yellow-900/30 border-yellow-500/30" };
    return { icon: fireLvl8, text: "Widerlegt", className: "bg-red-900/30 border-red-500/30" };
  };

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <motion.div 
        className="mb-6 flex items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/categories" className="text-cyan-400 hover:text-cyan-300 flex items-center transition-colors">
          <img src={backIcon} alt="Back" className="w-4 h-4 mr-1" />
          Zurück zur Übersicht
        </Link>
      </motion.div>
      
      <motion.div 
        className="bg-gray-800/70 rounded-xl border border-cyan-500/20 p-6 mb-8 shadow-lg backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <motion.div 
            className="relative rounded-xl overflow-hidden mb-6 border border-cyan-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {category.image && (
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-gray-900/90"></div>
              </div>
            )}
            <div className="relative p-6 z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white text-shadow-lg">{category.title}</h1>
              <p className="text-gray-200 max-w-3xl text-shadow-sm">{category.description}</p>
            </div>
          </motion.div>
          
          {/* Filter controls */}
          <motion.div 
            className="bg-gray-700/50 rounded-lg mb-6 backdrop-blur-sm border border-cyan-500/20 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Sort options */}
            <div className="p-4 border-b border-cyan-500/10">
              <label className="flex items-center text-sm text-cyan-400 mb-3 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sortieren nach
              </label>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-full sm:w-auto"
                >
                  <Button 
                    variant={sortOption === 'year' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSortOption('year')}
                    className={`w-full sm:w-auto ${sortOption === 'year' ? 'bg-cyan-700 hover:bg-cyan-600' : 'border-cyan-500/30 text-cyan-400 hover:text-cyan-300'}`}
                  >
                    Jahr
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-full sm:w-auto"
                >
                  <Button 
                    variant={sortOption === 'name' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSortOption('name')}
                    className={`w-full sm:w-auto ${sortOption === 'name' ? 'bg-cyan-700 hover:bg-cyan-600' : 'border-cyan-500/30 text-cyan-400 hover:text-cyan-300'}`}
                  >
                    Name
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-full sm:w-auto"
                >
                  <Button 
                    variant={sortOption === 'truth' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSortOption('truth')}
                    className={`w-full sm:w-auto ${sortOption === 'truth' ? 'bg-cyan-700 hover:bg-cyan-600' : 'border-cyan-500/30 text-cyan-400 hover:text-cyan-300'}`}
                  >
                    Wahrheitsgrad
                  </Button>
                </motion.div>
              </div>
            </div>
            
            {/* Filter options */}
            <div className="p-4">
              <label className="flex items-center text-sm text-cyan-400 mb-3 font-semibold">
                <motion.div 
                  className="mr-2"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FiFilter className="h-5 w-5" />
                </motion.div>
                Filtern nach Wahrheitsgrad
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button 
                    variant={filterTruth === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterTruth('all')}
                    className={`w-full ${filterTruth === 'all' ? 'bg-cyan-700 hover:bg-cyan-600' : 'border-cyan-500/30 text-cyan-400 hover:text-cyan-300'}`}
                  >
                    Alle
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button 
                    variant={filterTruth === 'confirmed' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterTruth('confirmed')}
                    className={`w-full ${filterTruth === 'confirmed' ? 'bg-green-700 hover:bg-green-600' : 'border-cyan-500/30 text-cyan-400 hover:text-cyan-300'}`}
                  >
                    Bestätigt
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button 
                    variant={filterTruth === 'controversial' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterTruth('controversial')}
                    className={`w-full ${filterTruth === 'controversial' ? 'bg-yellow-700 hover:bg-yellow-600' : 'border-cyan-500/30 text-cyan-400 hover:text-cyan-300'}`}
                  >
                    Umstritten
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button 
                    variant={filterTruth === 'debunked' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterTruth('debunked')}
                    className={`w-full ${filterTruth === 'debunked' ? 'bg-red-700 hover:bg-red-600' : 'border-cyan-500/30 text-cyan-400 hover:text-cyan-300'}`}
                  >
                    Widerlegt
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button 
                    variant={filterTruth === 'unconfirmed' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterTruth('unconfirmed')}
                    className={`w-full ${filterTruth === 'unconfirmed' ? 'bg-gray-700 hover:bg-gray-600' : 'border-cyan-500/30 text-cyan-400 hover:text-cyan-300'}`}
                  >
                    <TbExclamationMark className="mr-1 inline-block" />
                    <span className="hidden sm:inline">Nichts bestätigt</span>
                    <span className="sm:hidden">N/A</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Topics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          {sortedAndFilteredTopics.map((topic, index) => {
            const fireLevel = renderFireLevel(topic.truthRating);
            
            return (
              <motion.div 
                key={topic.id}
                className="bg-gray-700/50 rounded-lg overflow-hidden border border-cyan-500/10 hover:border-cyan-500/30 transition-all hover:shadow-lg group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)"
                }}
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">{topic.title}</h2>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-400">Erste Erwähnung: {topic.year}</p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge variant="outline" className={`${fireLevel.className} text-white flex items-center gap-1 px-3 py-1`}>
                        <img src={fireLevel.icon} alt="Truth Level" className="w-4 h-4" />
                        {fireLevel.text}
                      </Badge>
                    </motion.div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">{topic.description}</p>
                </div>
                
                {/* Card Footer */}
                <div className="border-t border-cyan-500/10 p-3 bg-gray-800/50 group-hover:bg-gray-700/80 transition-colors">
                  <Link href={`/topic/${topic.id}`} className="block">
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:bg-gray-600/50 group-hover:border-cyan-400/50"
                      >
                        <span className="mr-2">Details anzeigen</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
          
          {sortedAndFilteredTopics.length === 0 && (
            <div className="col-span-full text-center py-10">
              <span className="material-icons text-4xl text-gray-500 mb-2">search_off</span>
              <p className="text-gray-300">Keine Verschwörungstheorien gefunden, die den Filterkriterien entsprechen.</p>
              <Button 
                variant="outline" 
                className="mt-4 border-cyan-500/30 text-cyan-400 hover:text-cyan-300"
                onClick={() => {
                  setFilterTruth('all');
                  setSortOption('year');
                }}
              >
                Filter zurücksetzen
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryDetail;