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
    <div className="fixed top-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
      <div 
        ref={searchFieldRef}
        className="search-collapsed pointer-events-auto overflow-hidden bg-black/80 shadow-xl rounded-xl border border-cyan-500/20 backdrop-blur-lg flex flex-col"
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Suche nach Theorie, Zeitraum oder Stichwort..." 
              className="flex-1 outline-none text-lg bg-transparent text-gray-200 placeholder-gray-500"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
            />
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-cyan-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Slogan that appears when input is focused */}
          <AnimatePresence>
            {showSlogan && slogan && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-2 text-xs italic text-cyan-400"
              >
                {slogan}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {showFloatingTopics && (
          <div ref={floatingTopicsRef} className="p-6 h-96 relative">
            <FloatingTopics topics={filteredTopics || []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchField;
