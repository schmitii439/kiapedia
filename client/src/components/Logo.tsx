import React, { useEffect, useState } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  // Text typing animation
  useEffect(() => {
    const text = "KIAPEDIA";
    let index = 0;
    let timer: NodeJS.Timeout;
    
    const typeText = () => {
      if (index < text.length) {
        setTypedText(text.substring(0, index + 1));
        index++;
        timer = setTimeout(typeText, 150); // Speed of typing
      }
    };
    
    // Start the animation after a small delay
    const startTimer = setTimeout(() => {
      setIsLoaded(true);
      typeText();
    }, 500);
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      clearTimeout(startTimer);
    };
  }, []);
  
  // Logo flickering animation
  const flickerVariants = {
    initial: { 
      opacity: 0,
      filter: "brightness(0.5)"
    },
    animate: {
      opacity: [0, 1, 0.5, 1, 0.8, 1],
      filter: ["brightness(0.5)", "brightness(1.2)", "brightness(0.8)", "brightness(1.5)", "brightness(1)"],
      transition: {
        duration: 2.5,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex items-center group">
      <motion.div 
        className="w-16 h-16 rounded-full overflow-hidden mr-3 border-2 border-cyan-500/30 shadow-md z-10"
        variants={flickerVariants}
        initial="initial"
        animate="animate"
        whileHover={{ 
          scale: 1.1, 
          boxShadow: "0 0 20px rgba(6, 182, 212, 0.7)",
          borderColor: "rgba(6, 182, 212, 0.7)"
        }}
        whileTap={{ scale: 0.95 }}
      >
        <img 
          src={kiapediaLogo} 
          alt="KIAPEDIA Logo" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </motion.div>
      
      <div className="flex flex-col relative">
        <motion.h1 
          className="text-3xl font-bold text-white tracking-wide z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {typedText}
          <motion.span 
            className="inline-block w-[3px] h-8 bg-cyan-400 ml-1"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            style={{ display: typedText.length < 8 ? 'inline-block' : 'none' }}
          />
        </motion.h1>
        
        {/* Persistent slogan that shows when showSlogan is true */}
        {showSlogan && (
          <motion.p 
            className="text-xs italic text-cyan-300 mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2.5 }}
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
        
        {/* Menu indicator removed */}
      </div>
      
      {/* Animated glow effect behind the logo */}
      <motion.div
        className="absolute w-20 h-20 bg-cyan-500 rounded-full filter blur-xl opacity-0 group-hover:opacity-20 z-0"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.2, 0.8],
          opacity: isLoaded ? [0, 0.15, 0] : 0,
        }}
        transition={{ 
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
          delay: 2.5
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
