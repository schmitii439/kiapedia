import React from 'react';
import { useLocation } from 'wouter';
import kiapediaLogo from '@assets/kiapedia-logo.png';
import { motion } from 'framer-motion';

interface LogoProps {
  showSlogan?: boolean;
}

const Logo: React.FC<LogoProps> = ({ showSlogan = false }) => {
  const [location] = useLocation();
  const isHomePage = location === '/';
  const isCategoryPage = location.startsWith('/categories') || location.startsWith('/category/');

  return (
    <div className="flex items-center group">
      <motion.div 
        className="w-16 h-16 rounded-full overflow-hidden mr-3 border-2 border-cyan-500/30 shadow-md z-10"
        whileHover={{ 
          scale: 1.1, 
          boxShadow: "0 0 20px rgba(6, 182, 212, 0.7)",
          borderColor: "rgba(6, 182, 212, 0.7)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <img 
          src={kiapediaLogo} 
          alt="KIAPEDIA Logo" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </motion.div>
      
      <div className="flex flex-col relative">
        <h1 className="text-3xl font-bold text-white tracking-wide z-10">
          KIAPEDIA
        </h1>
        
        {/* Persistent slogan that shows when showSlogan is true */}
        {showSlogan && (
          <motion.p 
            className="text-xs italic text-cyan-300 mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            ... ich habe mies recherchiert!
          </motion.p>
        )}
        
        {/* Tooltip-like element that shows on hover when not showing slogan persistently */}
        {!showSlogan && (
          <motion.p 
            className="text-xs italic text-cyan-300 absolute -mt-1"
            initial={{ opacity: 0, y: -5 }}
            whileHover={{ opacity: 1, y: 15 }}
            transition={{ duration: 0.2 }}
          >
            ... ich hab mies recherchiert!
          </motion.p>
        )}
        
        {/* Menu indicator - only on home page */}
        {isHomePage && (
          <motion.div 
            className="absolute bottom-0 -right-5 mt-1 text-cyan-400 text-xs flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span>Menü</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </motion.div>
        )}
      </div>
      
      {/* Animated glow effect behind the logo */}
      <motion.div
        className="absolute w-20 h-20 bg-cyan-500 rounded-full filter blur-xl opacity-0 group-hover:opacity-20 z-0"
        initial={{ scale: 0.8 }}
        animate={{ 
          scale: [0.8, 1.2, 0.8],
          opacity: [0, 0.15, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
        style={{
          left: "8px",
          top: "8px"
        }}
      />
    </div>
  );
};

export default Logo;
