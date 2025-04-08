import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import FloatingTopics from './FloatingTopics';

interface SearchFieldProps {
  isVisible: boolean;
  onClose: () => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ isVisible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFloatingTopics, setShowFloatingTopics] = useState(false);
  const searchFieldRef = useRef<HTMLDivElement>(null);
  const floatingTopicsRef = useRef<HTMLDivElement>(null);

  // Fetch topics for search results
  const { data: topics } = useQuery({ 
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
    } else if (!isVisible && searchFieldRef.current) {
      // Collapse animation
      setShowFloatingTopics(false);
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

  // Filter topics based on search term
  const filteredTopics = topics?.filter(topic => 
    !searchTerm || 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.shortDescription && topic.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed top-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
      <div 
        ref={searchFieldRef}
        className="search-collapsed pointer-events-auto overflow-hidden bg-white shadow-xl rounded-xl flex flex-col dark:bg-gray-800"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <span className="material-icons text-gray-400 mr-3">search</span>
            <input 
              type="text" 
              placeholder="Suche nach Theorie, Zeitraum oder Stichwort..." 
              className="flex-1 outline-none text-lg bg-transparent dark:text-white"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button 
              onClick={onClose} 
              className="material-icons text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              close
            </button>
          </div>
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
