import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle } from '@/lib/firebase';
import gsap from 'gsap';
import { motion } from 'framer-motion';

// Import assets
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
// Die speziellen Bilder werden nur bei den entsprechenden Themenseiten eingesetzt

const Home: React.FC = () => {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  
  // Scroll to next section when "mehr" is clicked
  const handleMoreClick = () => {
    if (!showMore) {
      setShowMore(true);
      setTimeout(() => {
        const introSection = document.getElementById('registration-section');
        if (introSection) {
          introSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Animation effects for scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const registrationSection = document.getElementById('registration-section');
      const socialSection = document.getElementById('social-section');
      const donateSection = document.getElementById('donate-section');
      
      if (registrationSection) {
        const registrationPosition = registrationSection.offsetTop;
        if (scrollPosition + windowHeight * 0.75 > registrationPosition) {
          setShowRegistration(true);
        }
      }
      
      if (socialSection) {
        const socialPosition = socialSection.offsetTop;
        if (scrollPosition + windowHeight * 0.75 > socialPosition) {
          setShowSocial(true);
        }
      }
      
      if (donateSection) {
        const donatePosition = donateSection.offsetTop;
        if (scrollPosition + windowHeight * 0.75 > donatePosition) {
          setShowDonate(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sign in with Google
  const handleSignIn = async () => {
    try {
      toast({
        title: "Firebase-Integration",
        description: "Die Firebase-Authentifizierung würde hier funktionieren, wenn die API-Schlüssel konfiguriert wären.",
        duration: 3000,
      });
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
    <div className="min-h-screen w-full bg-zinc-900 text-white" ref={scrollRef}>
      {/* Intro/Hero Section */}
      <div 
        className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-8"
        style={{
          backgroundColor: 'rgb(9, 9, 11)',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.06), rgba(9, 9, 11, 0) 70%)',
        }}
      >
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-400">
            KIAPEDIA
          </h1>
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 sm:p-8 md:p-10 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-cyan-300">
              Die KI-gestützte Wissensdatenbank für Verschwörungstheoretiker
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Willkommen bei KIAPEDIA! Unsere Plattform ist ein innovatives Forum, das sich der Erforschung und Diskussion von Verschwörungstheorien widmet. Anders als herkömmliche Foren nutzt KIAPEDIA modernste KI-Technologien, um die Qualität und Tiefe der Diskussion zu verbessern.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              Wir bieten eine strukturierte Umgebung, in der verschiedene Verschwörungstheorien katalogisiert, analysiert und diskutiert werden können. Unser System nutzt KI, um Informationen zu kontextualisieren, Fakten zu prüfen und automatisch verwandte Theorien zu verknüpfen.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              KIAPEDIA ist nicht nur ein Forum, sondern ein digitales Archiv des alternativen Wissens, unterstützt durch fortschrittliche Technologie, um die Grenzen zwischen Fiktion und Realität zu erforschen.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 cursor-pointer"
          onClick={handleMoreClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xl mb-2 text-cyan-400">... mehr!</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="bg-cyan-500 rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Registration Section */}
      <div 
        id="registration-section"
        className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-8 bg-zinc-900"
      >
        <motion.div 
          className="max-w-4xl w-full mx-auto py-20"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: showRegistration ? 1 : 0, y: showRegistration ? 0 : 100 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative z-10">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-900/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-900/20 rounded-full filter blur-3xl"></div>
            
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-8 border border-cyan-500/20 shadow-xl relative z-20">
              <h2 className="text-3xl font-semibold mb-6 text-center text-cyan-300">Registrierung & Anmeldung</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-zinc-800/50 p-6 rounded-lg border border-cyan-800/30">
                  <h3 className="text-xl font-medium mb-4 text-white">Neues Konto erstellen</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Benutzername</label>
                      <input 
                        type="text" 
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Dein Benutzername"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">E-Mail</label>
                      <input 
                        type="email" 
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="deine@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Passwort</label>
                      <input 
                        type="password" 
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-white hover:from-cyan-400 hover:to-blue-500">
                      Registrieren
                    </Button>
                  </div>
                </div>
                
                <div className="bg-zinc-800/50 p-6 rounded-lg border border-cyan-800/30">
                  <h3 className="text-xl font-medium mb-4 text-white">Anmelden</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">E-Mail</label>
                      <input 
                        type="email" 
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="deine@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Passwort</label>
                      <input 
                        type="password" 
                        className="w-full bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-white hover:from-cyan-400 hover:to-blue-500">
                      Anmelden
                    </Button>
                    
                    <div className="mt-4 pt-4 border-t border-zinc-700">
                      <button 
                        onClick={handleSignIn}
                        className="w-full flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Mit Google anmelden
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Social Media Section */}
      <div 
        id="social-section"
        className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-8"
        style={{
          backgroundColor: '#0f172a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(56, 189, 248, 0.05), rgba(15, 23, 42, 0) 40%), radial-gradient(circle at 75% 75%, rgba(124, 58, 237, 0.05), rgba(15, 23, 42, 0) 40%)',
        }}
      >
        <motion.div 
          className="max-w-4xl w-full mx-auto py-20"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: showSocial ? 1 : 0, y: showSocial ? 0 : 100 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-8 border border-cyan-500/20 shadow-xl">
            <h2 className="text-3xl font-semibold mb-8 text-center text-cyan-300">Vernetze dich mit uns</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                className="bg-zinc-800/50 p-6 rounded-lg border border-cyan-800/30 flex flex-col items-center" 
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Facebook</h3>
                <p className="text-gray-400 text-sm text-center mb-4">Folge uns für tägliche Updates und Diskussionen</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Folgen</Button>
              </motion.div>
              
              <motion.div 
                className="bg-zinc-800/50 p-6 rounded-lg border border-cyan-800/30 flex flex-col items-center" 
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 mb-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">LinkedIn</h3>
                <p className="text-gray-400 text-sm text-center mb-4">Vernetze dich mit Gleichgesinnten</p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Verbinden</Button>
              </motion.div>
              
              <motion.div 
                className="bg-zinc-800/50 p-6 rounded-lg border border-cyan-800/30 flex flex-col items-center" 
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 mb-4 bg-blue-400 text-white rounded-full flex items-center justify-center text-2xl">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Twitter</h3>
                <p className="text-gray-400 text-sm text-center mb-4">Bleibe auf dem Laufenden mit unseren Tweets</p>
                <Button className="w-full bg-blue-400 hover:bg-blue-500">Folgen</Button>
              </motion.div>
              
              <motion.div 
                className="bg-zinc-800/50 p-6 rounded-lg border border-cyan-800/30 flex flex-col items-center" 
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 mb-4 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">YouTube</h3>
                <p className="text-gray-400 text-sm text-center mb-4">Sieh dir unsere neuesten Videos an</p>
                <Button className="w-full bg-red-600 hover:bg-red-700">Abonnieren</Button>
              </motion.div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-6">Teile Informationen und verbinde dich mit anderen Wahrheitssuchern!</p>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 text-lg rounded-md hover:from-cyan-400 hover:to-blue-500">
                Community beitreten
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Donation Section */}
      <div 
        id="donate-section"
        className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-8 bg-zinc-900"
      >
        <motion.div 
          className="max-w-4xl w-full mx-auto py-20"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: showDonate ? 1 : 0, y: showDonate ? 0 : 100 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative z-10">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-900/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-900/20 rounded-full filter blur-3xl"></div>
            
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-8 border border-cyan-500/20 shadow-xl relative z-20">
              <h2 className="text-3xl font-semibold mb-6 text-center text-cyan-300">Unterstütze KIAPEDIA</h2>
              
              <p className="text-gray-300 mb-8 text-center max-w-2xl mx-auto">
                Deine Unterstützung hilft uns, die Plattform zu verbessern und unabhängig zu bleiben. Jeder Beitrag ist wertvoll und hilft uns, die Wahrheit zu verbreiten.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <motion.div 
                  className="bg-zinc-800/50 p-6 rounded-lg border border-cyan-800/30 flex flex-col items-center" 
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-16 h-16 mb-4 bg-cyan-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">€5</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Basic</h3>
                  <p className="text-gray-400 text-sm text-center mb-4">Unterstütze uns mit einem kleinen Beitrag</p>
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600">
                    Spenden
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="bg-zinc-800/50 p-6 rounded-lg border border-cyan-600/50 flex flex-col items-center relative shadow-lg shadow-cyan-500/20" 
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white text-xs py-1 px-3 rounded-full">
                    BELIEBT
                  </div>
                  <div className="w-16 h-16 mb-4 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">€20</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Standard</h3>
                  <p className="text-gray-400 text-sm text-center mb-4">Unterstütze unsere Mission und Server</p>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500">
                    Spenden
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="bg-zinc-800/50 p-6 rounded-lg border border-cyan-800/30 flex flex-col items-center" 
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-16 h-16 mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">€50</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Premium</h3>
                  <p className="text-gray-400 text-sm text-center mb-4">Werde zu einem wichtigen Unterstützer</p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">
                    Spenden
                  </Button>
                </motion.div>
              </div>
              
              <div className="bg-zinc-800/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4 text-white text-center">Benutzerdefinierter Betrag</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="number" 
                    min="1"
                    className="flex-1 bg-zinc-700 border border-zinc-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Gib deinen Betrag ein"
                  />
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-md hover:from-cyan-400 hover:to-blue-500">
                    Spenden
                  </Button>
                </div>
              </div>
              
              <div className="mt-12 flex justify-center">
                <Link href="/categories">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 text-lg rounded-md hover:from-cyan-400 hover:to-blue-500">
                      <div className="flex items-center">
                        <span className="mr-2">Verschwörungen entdecken</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </div>
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
