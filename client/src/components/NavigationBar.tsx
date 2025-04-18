import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface NavigationBarProps {
  onShowSearchField: () => void;
  mode?: 'vertical' | 'horizontal';
  hideSearch?: boolean;
  hideSocial?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  onShowSearchField, 
  mode = 'vertical',
  hideSearch = false,
  hideSocial = false
}) => {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [location] = useLocation();
  const { toast } = useToast();
  const isHorizontal = mode === 'horizontal';

  // Check if current location matches a specific route
  const isActive = (path: string) => {
    return location === path;
  };

  // Handle click on search
  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onShowSearchField();
  };

  // Auth placeholder for demo
  const handleAuthClick = () => {
    toast({
      title: "Firebase-Integration",
      description: "Firebase-Authentifizierung würde hier implementiert werden.",
      duration: 3000,
    });
  };

  // Animation variants for menu items
  const itemVariants = {
    hidden: isHorizontal 
      ? { opacity: 0, y: -10 }
      : { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: isHorizontal ? 0 : undefined,
      x: isHorizontal ? undefined : 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        type: "spring",
        stiffness: 100,
      }
    })
  };

  // Render horizontal navigation
  if (isHorizontal) {
    return (
      <div className="bg-gradient-to-r from-gray-900/95 to-black/95 shadow-xl z-40 rounded-b-xl backdrop-blur-lg py-3 px-4 border border-cyan-900/30 border-t-0 w-full">
        {/* Main navigation items */}
        <div className="flex flex-col gap-3">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <Link 
              href="/" 
              className={`transition-all flex items-center gap-3 p-2 rounded-md ${isActive('/') ? 'bg-cyan-900/30 text-cyan-300' : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50'}`}
              title="Startseite"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </Link>
          </motion.div>

          {/* Search option (conditionally rendered) */}
          {!hideSearch && (
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <button 
                onClick={handleSearchClick}
                className="text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 transition-all flex items-center gap-3 w-full text-left p-2 rounded-md" 
                title="Suchen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-medium">Suchen</span>
              </button>
            </motion.div>
          )}

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <Link 
              href="/categories" 
              className={`transition-all flex items-center gap-3 p-2 rounded-md ${isActive('/categories') || location.startsWith('/category/') ? 'bg-cyan-900/30 text-cyan-300' : 'text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50'}`}
              title="Verschwörungen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-sm font-medium">Theorien</span>
            </Link>
          </motion.div>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <button 
              onClick={handleAuthClick}
              className="text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 transition-all flex items-center gap-3 w-full text-left p-2 rounded-md" 
              title="Login"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">Login</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render vertical navigation (original)
  return (
    <div className="h-full w-20 bg-gradient-to-b from-gray-900/95 to-black/95 shadow-2xl z-40 flex flex-col items-center py-8 border-l border-cyan-900/30 backdrop-blur-lg">
      {/* Close button at the top */}
      <motion.div 
        className="absolute top-3 right-3"
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Link href="/" className="text-gray-400 hover:text-cyan-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
      </motion.div>

      {/* Navigation heading */}
      <motion.div 
        className="mb-10 mt-4 text-cyan-500 text-sm font-semibold rotate-90 tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        NAVIGATION
      </motion.div>

      {/* Main navigation items */}
      <div className="flex flex-col items-center space-y-10">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <Link 
            href="/" 
            className={`transition-all flex flex-col items-center ${isActive('/') ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-500'}`} 
            title="Startseite"
          >
            <div className={`p-3 rounded-full ${isActive('/') ? 'bg-cyan-900/30' : 'hover:bg-gray-800/50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xs mt-1">Home</span>
          </Link>
        </motion.div>

        {!hideSearch && (
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <button 
              onClick={handleSearchClick}
              className="text-gray-400 hover:text-cyan-500 transition-all flex flex-col items-center" 
              title="Suchen"
            >
              <div className="p-3 rounded-full hover:bg-gray-800/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-xs mt-1">Suchen</span>
            </button>
          </motion.div>
        )}

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <Link 
            href="/categories" 
            className={`transition-all flex flex-col items-center ${isActive('/categories') || location.startsWith('/category/') ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-500'}`} 
            title="Verschwörungen"
          >
            <div className={`p-3 rounded-full ${isActive('/categories') || location.startsWith('/category/') ? 'bg-cyan-900/30' : 'hover:bg-gray-800/50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <span className="text-xs mt-1">Theorien</span>
          </Link>
        </motion.div>
      </div>

      {/* Footer items */}
      {!hideSocial && (
        <div className="mt-auto flex flex-col items-center space-y-6">
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <button 
              onClick={handleAuthClick}
              className="text-gray-400 hover:text-cyan-500 transition-all flex flex-col items-center" 
              title="Login"
            >
              <div className="p-3 rounded-full hover:bg-gray-800/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs mt-1">Login</span>
            </button>
          </motion.div>

          <motion.div 
            className="mb-5 opacity-60"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <div className="text-cyan-500/50 text-xs mt-10 flex flex-col items-center">
              <div className="w-10 h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent mb-5"></div>
              <span className="mt-1">v1.0.4</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Decorative elements */}
      <motion.div 
        className="absolute top-1/2 -translate-y-1/2 left-0 w-[1px] h-[30%]"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        style={{ 
          background: "linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.3), transparent)" 
        }}
      />
    </div>
  );
};

export default NavigationBar;