import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';
import NavigationBar from '@/components/NavigationBar';
import SearchField from '@/components/SearchField';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'wouter';
// User icon comes from NavigationBar component

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [searchFieldVisible, setSearchFieldVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [isCategoryPage, setIsCategoryPage] = useState(false);
  const [location] = useLocation();

  // Determine if we're on specific pages
  useEffect(() => {
    setIsHomePage(location === '/');
    setIsCategoryPage(location.startsWith('/categories') || location.startsWith('/category/'));
  }, [location]);

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

  // Search button at the bottom for category pages
  const renderCategorySearch = () => {
    if (!isCategoryPage) return null;

    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <motion.button
          className="flex items-center gap-2 bg-gray-900/80 border border-cyan-500/30 py-2 px-4 rounded-full shadow-lg backdrop-blur-sm text-gray-300 hover:text-cyan-300"
          onClick={handleShowSearchField}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Suchen</span>
        </motion.button>
      </div>
    );
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
              <Logo showSlogan={navVisible} />
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
                  className="absolute left-0 top-full z-40 w-auto max-w-[50%]"
                  style={{
                    // Visual connection to the logo
                    marginTop: "-5px",
                    borderTop: "2px solid rgba(6, 182, 212, 0.3)",
                  }}
                >
                  <div className="py-2">
                    <NavigationBar 
                      onShowSearchField={handleShowSearchField} 
                      mode="horizontal"
                      hideSocial={isCategoryPage}
                      hideSearch={isCategoryPage}
                    />
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
        
        {/* Category page search button */}
        {renderCategorySearch()}
      </div>

      {/* Search field with slogan */}
      <SearchField 
        isVisible={searchFieldVisible} 
        onClose={handleCloseSearchField}
        slogan="... ich hab mies recherchiert!"
      />
    </div>
  );
};

export default MainLayout;
