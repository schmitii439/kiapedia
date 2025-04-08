import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle } from '@/lib/firebase';
import gsap from 'gsap';
import { motion } from 'framer-motion';

// Import fire level icons
import fireLvl1 from '@assets/fire-level-1.png';
import fireLvl2 from '@assets/fire-level-2.png';
import fireLvl3 from '@assets/fire-level-3.png';
import fireLvl4 from '@assets/fire-level-4.png';
import fireLvl5 from '@assets/fire-level-5.png';
import fireLvl6 from '@assets/fire-level-6.png';
import fireLvl7 from '@assets/fire-level-7.png';
import fireLvl8 from '@assets/fire-level-8.png';
import backIcon from '@assets/back.png';
import commentIcon from '@assets/comment.png';
import docIcon from '@assets/doc.png';
import categoryIcon from '@assets/category.png';

const Home: React.FC = () => {
  const { toast } = useToast();
  const fireIconsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Fire icons animation sequence
  useEffect(() => {
    if (fireIconsRef.current) {
      const fireIcons = [
        fireLvl1, fireLvl2, fireLvl3, fireLvl4, 
        fireLvl5, fireLvl6, fireLvl7, fireLvl8
      ];
      
      const container = fireIconsRef.current;
      
      // Create the fire icons if they don't exist
      if (container.children.length === 0) {
        fireIcons.forEach((icon, index) => {
          const img = document.createElement('img');
          img.src = icon;
          img.className = 'absolute w-16 h-16 opacity-0';
          img.style.top = `${Math.random() * 80}%`;
          img.style.left = `${Math.random() * 80}%`;
          img.dataset.index = index.toString();
          container.appendChild(img);
        });
      }
      
      // Animate the fire icons
      const timeline = gsap.timeline({ repeat: -1 });
      
      gsap.utils.toArray(container.children).forEach((icon, i) => {
        const htmlIcon = icon as HTMLElement;
        // Random position for each icon
        gsap.set(icon, { 
          x: Math.random() * 300 - 150,
          y: Math.random() * 200 - 100,
          rotation: Math.random() * 20 - 10,
          scale: 0.8 + Math.random() * 0.5
        });
        
        // Pulse animation for each icon
        timeline.to(icon, { 
          opacity: 0.8, 
          duration: 0.7, 
          ease: "power2.inOut",
          delay: i * 0.1
        }, i * 0.2)
        .to(icon, { 
          opacity: 0, 
          duration: 0.7, 
          ease: "power2.inOut" 
        }, `>-0.3`);
      });
    }
    
    // Header animation
    if (headerRef.current) {
      gsap.from(headerRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
      });
    }
  }, []);

  // Handle sign in with Google
  const handleSignIn = async () => {
    try {
      // For demonstration without actual Firebase keys
      toast({
        title: "Firebase-Integration",
        description: "Die Firebase-Authentifizierung würde hier funktionieren, wenn die API-Schlüssel konfiguriert wären.",
        duration: 3000,
      });
      
      // Uncomment this when Firebase keys are provided
      /*
      const user = await signInWithGoogle();
      if (user) {
        toast({
          title: "Erfolgreich angemeldet",
          description: `Willkommen, ${user.displayName || 'Benutzer'}!`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Anmeldung fehlgeschlagen",
          description: "Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
      */
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Fehler bei der Anmeldung",
        description: "Es gab ein Problem mit der Firebase-Authentifizierung.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto relative">
      {/* Mystical fire icons container */}
      <div 
        ref={fireIconsRef} 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      />
      
      <div ref={headerRef} className="mb-12 text-center relative z-10">
        <motion.h1 
          className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Willkommen zum KI-gestützten Analyse-Forum
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-400 max-w-3xl mx-auto dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Ein Ort für kritische Betrachtung und fundierte Diskussion über Verschwörungstheorien
          mit Unterstützung moderner KI-Technologie.
        </motion.p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <motion.div 
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-md border border-cyan-800 hover:shadow-cyan-600/20 hover:shadow-lg transition-all dark:bg-gray-800 dark:border-gray-700"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center mb-4">
            <img src={docIcon} alt="Document icon" className="w-10 h-10 mr-3" />
            <h2 className="text-2xl font-bold text-cyan-400">Kritische Analyse</h2>
          </div>
          <p className="text-gray-300">
            Verschwörungstheorien werden hier mit einem wissenschaftlichen, 
            skeptischen Ansatz betrachtet. Jedes Thema wird ausführlich, 
            ehrlich und mit echtem menschlichen Verstand angegangen.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-md border border-cyan-800 hover:shadow-cyan-600/20 hover:shadow-lg transition-all dark:bg-gray-800 dark:border-gray-700"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center mb-4">
            <img src={fireLvl4} alt="Fire icon" className="w-10 h-10 mr-3" />
            <h2 className="text-2xl font-bold text-cyan-400">KI-Unterstützung</h2>
          </div>
          <p className="text-gray-300">
            Multiple AI-Systeme (OpenAI, Perplexity, Anthropic) helfen bei der 
            Analyse, Kontextualisierung und Faktenprüfung aller Beiträge und Theorien.
          </p>
        </motion.div>
      </div>
      
      <motion.div 
        className="bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 rounded-2xl p-8 text-white mb-16 border border-cyan-700/30 shadow-lg shadow-cyan-500/10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-8 relative">
            <motion.img 
              src={fireLvl8} 
              alt="Flame" 
              className="absolute -top-12 -left-12 w-24 opacity-70 z-0"
              animate={{ 
                opacity: [0.4, 0.7, 0.4], 
                scale: [0.95, 1.05, 0.95],
                rotate: [-2, 2, -2]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-3 text-cyan-300">Starten Sie noch heute</h2>
              <p className="mb-4 text-gray-200">Melden Sie sich an und beginnen Sie Ihre Erkundung historischer und moderner Verschwörungstheorien.</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleSignIn}
                  className="bg-cyan-500/80 hover:bg-cyan-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors border border-cyan-400/30 shadow-md"
                >
                  Anmeldung
                </Button>
              </motion.div>
            </div>
          </div>
          <div className="backdrop-blur-md bg-cyan-950/30 p-6 rounded-xl flex-1 border border-cyan-800/50">
            <h3 className="text-lg font-semibold mb-3 text-cyan-200">Features:</h3>
            <ul className="space-y-3">
              <motion.li 
                className="flex items-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <img src={fireLvl3} alt="Fire level 3" className="w-5 h-5 mr-2" />
                <span className="text-gray-200">Historische Chronologie vom 18. bis 21. Jahrhundert</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <img src={fireLvl3} alt="Fire level 3" className="w-5 h-5 mr-2" />
                <span className="text-gray-200">KI-gestützte Echtheitsprüfung von Informationen</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <img src={fireLvl3} alt="Fire level 3" className="w-5 h-5 mr-2" />
                <span className="text-gray-200">Interaktive Visualisierungen und Zeitlinien</span>
              </motion.li>
              <motion.li 
                className="flex items-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <img src={fireLvl3} alt="Fire level 3" className="w-5 h-5 mr-2" />
                <span className="text-gray-200">Community-basierte Diskussionen mit KI-Moderation</span>
              </motion.li>
            </ul>
          </div>
        </div>
      </motion.div>
      
      <div className="mb-16">
        <motion.h2 
          className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          KI-Technologien & Integration
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            className="flex flex-col items-center p-5 bg-gray-900/60 backdrop-blur-sm rounded-lg shadow-lg border border-cyan-800/30 hover:shadow-cyan-500/20 hover:border-cyan-700/50 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <img src={fireLvl5} className="w-10 h-10 mb-3" alt="OpenAI" />
            <h3 className="font-semibold mb-1 text-cyan-400">OpenAI</h3>
            <p className="text-sm text-center text-gray-300">KI-gestützte Analyse & Beratung</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center p-5 bg-gray-900/60 backdrop-blur-sm rounded-lg shadow-lg border border-cyan-800/30 hover:shadow-cyan-500/20 hover:border-cyan-700/50 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <img src={fireLvl4} className="w-10 h-10 mb-3" alt="Anthropic" />
            <h3 className="font-semibold mb-1 text-cyan-400">Anthropic</h3>
            <p className="text-sm text-center text-gray-300">Historische Kontextanalyse</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center p-5 bg-gray-900/60 backdrop-blur-sm rounded-lg shadow-lg border border-cyan-800/30 hover:shadow-cyan-500/20 hover:border-cyan-700/50 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <img src={fireLvl3} className="w-10 h-10 mb-3" alt="Perplexity" />
            <h3 className="font-semibold mb-1 text-cyan-400">Perplexity</h3>
            <p className="text-sm text-center text-gray-300">Echtzeit-Faktenüberprüfung</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center p-5 bg-gray-900/60 backdrop-blur-sm rounded-lg shadow-lg border border-cyan-800/30 hover:shadow-cyan-500/20 hover:border-cyan-700/50 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <img src={commentIcon} className="w-10 h-10 mb-3" alt="Community Chat" />
            <h3 className="font-semibold mb-1 text-cyan-400">KI-Moderation</h3>
            <p className="text-sm text-center text-gray-300">Inhaltsqualität & Moderation</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center p-5 bg-gray-900/60 backdrop-blur-sm rounded-lg shadow-lg border border-cyan-800/30 hover:shadow-cyan-500/20 hover:border-cyan-700/50 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <img src={categoryIcon} className="w-10 h-10 mb-3" alt="Kategorisierung" />
            <h3 className="font-semibold mb-1 text-cyan-400">Kategorisierung</h3>
            <p className="text-sm text-center text-gray-300">Automatisierte Themeneinteilung</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center p-5 bg-gray-900/60 backdrop-blur-sm rounded-lg shadow-lg border border-cyan-800/30 hover:shadow-cyan-500/20 hover:border-cyan-700/50 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <img src={docIcon} className="w-10 h-10 mb-3" alt="Dokumentation" />
            <h3 className="font-semibold mb-1 text-cyan-400">Quellenbewertung</h3>
            <p className="text-sm text-center text-gray-300">Vertrauenswürdigkeit & Einordnung</p>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.7 }}
      >
        <Link href="/conspiracy-theories">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 px-10 rounded-lg shadow-lg shadow-cyan-500/20 border border-cyan-400/30 hover:shadow-cyan-500/40 transition-all">
              <div className="flex items-center">
                <img src={fireLvl7} alt="Fire" className="w-6 h-6 mr-3" />
                <span className="text-lg">Theorien erkunden</span>
                <img src={backIcon} alt="Arrow" className="w-5 h-5 ml-3 rotate-180" />
              </div>
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
