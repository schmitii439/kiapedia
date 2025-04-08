import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import kiapediaLogo from '@assets/kiapedia-logo.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [progress, setProgress] = useState(0);
  
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
    
    // Start typing after a short delay
    setTimeout(typeText, 800);
    
    // Cleanup
    return () => clearTimeout(timer);
  }, []);
  
  // Progress bar animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Start progress bar after typing animation has begun
    const startProgress = setTimeout(() => {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          
          // When progress reaches 100, trigger the complete callback
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // Wait a bit before completing
            setTimeout(onLoadingComplete, 500);
            return 100;
          }
          
          return newProgress;
        });
      }, 30); // Speed of progress bar
    }, 1000);
    
    // Cleanup
    return () => {
      clearTimeout(startProgress);
      clearInterval(interval);
    };
  }, [onLoadingComplete]);
  
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
    <motion.div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex flex-col items-center">
        {/* Larger logo for loading screen */}
        <motion.div 
          className="w-32 h-32 rounded-full overflow-hidden mb-5 border-2 border-cyan-500/30 shadow-lg"
          variants={flickerVariants}
          initial="initial"
          animate="animate"
        >
          <img 
            src={kiapediaLogo} 
            alt="KIAPEDIA Logo" 
            className="w-full h-full object-cover" 
          />
        </motion.div>
        
        {/* Animated title */}
        <div className="mb-8 relative">
          <motion.h1 
            className="text-5xl font-bold text-white tracking-wide text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {typedText}
            <motion.span 
              className="inline-block w-[4px] h-12 bg-cyan-400 ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ display: typedText.length < 8 ? 'inline-block' : 'none' }}
            />
          </motion.h1>
          
          <motion.p 
            className="text-sm italic text-cyan-300 mt-2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: typedText.length >= 8 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            ... ich hab mies recherchiert!
          </motion.p>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-cyan-500"
            style={{ width: `${progress}%` }}
            initial={{ width: '0%' }}
          />
        </div>
        
        {/* Loading text */}
        <motion.p 
          className="text-xs text-gray-400 mt-3"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          Laden... {progress}%
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;