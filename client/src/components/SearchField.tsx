import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import FloatingTopics from './FloatingTopics';
import { motion, AnimatePresence } from 'framer-motion';
import { Topic } from '@shared/schema';

interface SearchFieldProps {
  isVisible: boolean;
  onClose: () => void;
  slogan?: string;
}

const SearchField: React.FC<SearchFieldProps> = ({ isVisible, onClose, slogan }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFloatingTopics, setShowFloatingTopics] = useState(false);
  const [showSlogan, setShowSlogan] = useState(false);
  const searchFieldRef = useRef<HTMLDivElement>(null);
  const floatingTopicsRef = useRef<HTMLDivElement>(null);

  // Fetch topics for search results
  const { data: topics } = useQuery<Topic[]>({ 
    queryKey: ['/api/topics'],
    enabled: isVisible
  });

  // Close search when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchFieldRef.current && 
        !searchFieldRef.current.contains(event.target as Node) &&
        isVisible
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // Animate search field expansion/collapse
  useEffect(() => {
    if (isVisible && searchFieldRef.current) {
      // Expand animation
      gsap.to(searchFieldRef.current, {
        width: '50%',
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          setShowFloatingTopics(true);
        }
      });
      
      // Reset slogan state
      setShowSlogan(false);
    } else if (!isVisible && searchFieldRef.current) {
      // Collapse animation
      setShowFloatingTopics(false);
      setShowSlogan(false);
      gsap.to(searchFieldRef.current, {
        width: 0,
        duration: 0.5,
        ease: "power2.in"
      });
    }
  }, [isVisible]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle input focus to show slogan
  const handleInputFocus = () => {
    if (slogan) {
      setShowSlogan(true);
    }
  };

  // Filter topics based on search term
  const filteredTopics = topics ? topics.filter((topic: Topic) => 
    !searchTerm || 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.shortDescription && topic.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          
          {/* Search container */}
          <div className="flex flex-col items-center relative w-full h-screen pointer-events-auto">
            <motion.div 
              ref={searchFieldRef}
              className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 mt-4 overflow-hidden bg-gray-900/95 shadow-2xl rounded-xl border border-cyan-500/30 backdrop-blur-lg flex flex-col"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 300
              }}
            >
              <div className="p-4 border-b border-cyan-900/40">
                <div className="flex items-center">
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 0],
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 5
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.div>
                  <input 
                    type="text" 
                    placeholder="Suche nach Theorie, Zeitraum oder Stichwort..." 
                    className="flex-1 outline-none text-lg bg-transparent text-gray-200 placeholder-gray-500"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={handleInputFocus}
                    autoFocus
                  />
                  <motion.button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-cyan-400 p-2 rounded-full"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                
                {/* Slogan that appears when input is focused with glowing animation */}
                <AnimatePresence>
                  {showSlogan && slogan && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        textShadow: ["0 0 0px rgba(8, 145, 178, 0)", "0 0 10px rgba(8, 145, 178, 0.7)", "0 0 0px rgba(8, 145, 178, 0)"]
                      }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ 
                        duration: 0.3,
                        textShadow: {
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }
                      }}
                      className="mt-2 text-sm italic text-cyan-400"
                    >
                      {slogan}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Floating topics container with improved animation */}
              <AnimatePresence>
                {showFloatingTopics && (
                  <motion.div 
                    ref={floatingTopicsRef} 
                    className="p-6 max-h-96 overflow-auto relative"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FloatingTopics topics={filteredTopics || []} />
                    
                    {/* Decorative background elements */}
                    <motion.div 
                      className="absolute -bottom-8 right-0 w-32 h-32 bg-cyan-900/10 rounded-full filter blur-3xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    
                    <motion.div 
                      className="absolute -top-4 left-10 w-24 h-24 bg-indigo-900/10 rounded-full filter blur-3xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.15, 0.1]
                      }}
                      transition={{
                        duration: 6,
                        delay: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Small decorative elements in the corners */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-500/30"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  boxShadow: [
                    "0 0 0px rgba(8, 145, 178, 0.3)",
                    "0 0 10px rgba(8, 145, 178, 0.7)",
                    "0 0 0px rgba(8, 145, 178, 0.3)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <motion.div
                className="absolute bottom-4 left-4 w-1 h-1 rounded-full bg-cyan-500/30"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  boxShadow: [
                    "0 0 0px rgba(8, 145, 178, 0.3)",
                    "0 0 5px rgba(8, 145, 178, 0.7)",
                    "0 0 0px rgba(8, 145, 178, 0.3)"
                  ]
                }}
                transition={{
                  duration: 2,
                  delay: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchField;
