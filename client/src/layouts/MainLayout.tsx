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
      <div className="flex-1 px-4 transition-all duration-500">
        <div className="relative">
          {/* Logo and Navigation container - logo is clickable to toggle navigation */}
          <div className={`${isHomePage ? 'absolute top-0 left-0 z-50' : ''}`}>
            <div 
              className="py-4 px-2 cursor-pointer"
              onClick={toggleNavigation}
            >
              <Logo />
            </div>
            
            {/* Navigation menu that drops down below logo */}
            <AnimatePresence>
              {navVisible && (
                <motion.div
                  initial={{ y: -20, opacity: 0, height: 0 }}
                  animate={{ y: 0, opacity: 1, height: 'auto' }}
                  exit={{ y: -20, opacity: 0, height: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30
                  }}
                  className="absolute left-0 top-full z-40 w-auto"
                  style={{
                    // Visual connection to the logo
                    marginTop: "-5px",
                    borderTop: "2px solid rgba(6, 182, 212, 0.3)",
                  }}
                >
                  <div className="py-2">
                    <NavigationBar onShowSearchField={handleShowSearchField} mode="horizontal" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Page content */}
        <main>
          {children}
        </main>
      </div>

      {/* Search field */}
      <SearchField 
        isVisible={searchFieldVisible} 
        onClose={handleCloseSearchField} 
      />
    </div>
  );
};

export default MainLayout;
