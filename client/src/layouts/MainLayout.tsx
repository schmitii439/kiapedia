import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';
import NavigationBar from '@/components/NavigationBar';
import SearchField from '@/components/SearchField';
import { AnimatePresence, motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [searchFieldVisible, setSearchFieldVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);

  // Determine if we're on the homepage
  useEffect(() => {
    const path = window.location.pathname;
    setIsHomePage(path === '/');
  }, []);

  // Show search field
  const handleShowSearchField = () => {
    setSearchFieldVisible(true);
  };

  // Hide search field
  const handleCloseSearchField = () => {
    setSearchFieldVisible(false);
  };

  // Toggle navigation visibility
  const toggleNavigation = () => {
    setNavVisible(!navVisible);
  };

  return (
    <div className="flex min-h-screen relative bg-zinc-900">
      {/* Main content area */}
      <div className={`flex-1 ${navVisible ? 'pr-20' : 'pr-4'} pl-4 transition-all duration-500`}>
        {/* Logo - now clickable to toggle navigation */}
        <div 
          className={`py-4 px-2 ${isHomePage ? 'absolute top-0 left-0 z-50' : ''}`}
          onClick={toggleNavigation}
        >
          <div className="cursor-pointer">
            <Logo />
          </div>
        </div>
        
        {/* Page content */}
        <main>
          {children}
        </main>
      </div>

      {/* Animated Vertical navigation bar */}
      <AnimatePresence>
        {navVisible && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30
            }}
            className="fixed top-0 right-0 z-40 h-full"
          >
            <NavigationBar onShowSearchField={handleShowSearchField} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search field */}
      <SearchField 
        isVisible={searchFieldVisible} 
        onClose={handleCloseSearchField} 
      />
    </div>
  );
};

export default MainLayout;
