import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Home: React.FC = () => {
  const { toast } = useToast();
  const [showMenu, setShowMenu] = useState(false);
  
  // Toggle navigation menu visibility
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Pure black background */}
      <div className="fixed inset-0 bg-black z-0" />
      
      {/* Ambient color glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Cyan glow */}
        <div 
          className="absolute top-[20%] right-[25%] w-[40vh] h-[40vh] rounded-full bg-cyan-500/5 blur-[100px]"
          style={{
            animation: "pulse 15s ease-in-out infinite alternate"
          }}
        />
        
        {/* Violet glow */}
        <div
          className="absolute bottom-[20%] left-[15%] w-[35vh] h-[35vh] rounded-full bg-indigo-500/5 blur-[120px]" 
          style={{
            animation: "pulse 18s ease-in-out 2s infinite alternate"
          }}
        />
        
        {/* Blue subtle glow */}
        <div
          className="absolute top-[30%] left-[30%] w-[45vh] h-[30vh] rounded-full bg-blue-500/3 blur-[150px]" 
          style={{
            animation: "pulse 20s ease-in-out 1s infinite alternate"
          }}
        />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Main title with glow effect */}
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-400"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            KIAPEDIA
          </motion.h1>
          
          {/* Main content box with glassmorphism effect */}
          <motion.div 
            className="bg-black/40 backdrop-blur-md rounded-xl p-6 sm:p-8 md:p-10 border border-cyan-500/20 shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h2 
              className="text-2xl sm:text-3xl font-semibold mb-6 text-cyan-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Die KI-gestützte Wissensdatenbank für Verschwörungstheoretiker
            </motion.h2>
            
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <p className="text-lg text-gray-300 mb-6">
                  Willkommen bei KIAPEDIA! Unsere Plattform ist ein innovatives Forum, das sich der Erforschung und Diskussion von Verschwörungstheorien widmet.
                </p>
                
                <div className="relative mb-8 p-6 bg-gradient-to-r from-gray-900/30 to-gray-800/30 rounded-lg border border-cyan-500/10">
                  <motion.div 
                    className="absolute -top-3 -left-3 w-16 h-16 opacity-10"
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 20, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  >
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="45" stroke="rgba(6, 182, 212, 0.8)" strokeWidth="2" />
                      <circle cx="50" cy="50" r="30" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="1" />
                      <path d="M50 5 L50 95" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
                      <path d="M5 50 L95 50" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
                    </svg>
                  </motion.div>
                  
                  <p className="text-lg text-gray-300">
                    KIAPEDIA nutzt modernste KI-Technologien, um eine strukturierte Umgebung zu bieten, in der Verschwörungstheorien katalogisiert, analysiert und diskutiert werden können. Unser System kontextualisiert Informationen, prüft Fakten und verknüpft automatisch verwandte Theorien.
                  </p>
                </div>
                
                <p className="text-lg text-gray-300">
                  Ein digitales Archiv des alternativen Wissens, unterstützt durch fortschrittliche Technologie, um die Grenzen zwischen Fiktion und Realität zu erforschen.
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
        
        {/* Menu arrow indicator removed as requested */}
        
        {/* Animated decorative elements */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Top left decorative element */}
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 opacity-10"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />
              <circle cx="50" cy="50" r="30" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
              <path d="M50 5 L50 95" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
              <path d="M5 50 L95 50" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="3" fill="rgba(6, 182, 212, 0.8)" />
            </svg>
          </motion.div>
          
          {/* Bottom right decorative element */}
          <motion.div
            className="absolute bottom-10 right-10 w-40 h-40 opacity-10"
            initial={{ rotate: 180 }}
            animate={{ rotate: -180 }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />
              <circle cx="50" cy="50" r="30" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
              <path d="M50 5 L50 95" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
              <path d="M5 50 L95 50" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="5" fill="rgba(6, 182, 212, 0.6)" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse {
          0% {
            opacity: 0.3;
            transform: scale(0.9);
          }
          100% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        `
      }} />
    </div>
  );
};

export default Home;