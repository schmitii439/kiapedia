import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface NavigationBarProps {
  onShowSearchField: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onShowSearchField }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [location] = useLocation();
  const { toast } = useToast();

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

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

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
      setDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  return (
    <div className="fixed top-0 right-0 h-full w-16 bg-zinc-900/95 shadow-lg z-40 flex flex-col items-center py-6 border-l border-gray-800">
      <Link 
        href="/" 
        className={`mb-10 transition-colors ${isActive('/') ? 'text-cyan-500' : 'text-gray-400 hover:text-cyan-500'}`} 
        title="Startseite"
      >
        <span className="material-icons text-2xl">home</span>
      </Link>
      
      <button 
        onClick={handleSearchClick}
        className="text-gray-400 hover:text-cyan-500 transition-colors" 
        title="Suchen"
      >
        <span className="material-icons text-2xl">search</span>
      </button>
      
      <Link 
        href="/categories" 
        className={`mt-6 transition-colors ${isActive('/categories') ? 'text-cyan-500' : 'text-gray-400 hover:text-cyan-500'}`} 
        title="Verschwörungen"
      >
        <span className="material-icons text-2xl">category</span>
      </Link>
      
      <div className="mt-auto flex flex-col items-center space-y-6">
        <button 
          onClick={handleAuthClick}
          className="text-gray-400 hover:text-cyan-500 transition-colors" 
          title="Login"
        >
          <span className="material-icons text-2xl">person</span>
        </button>
        
        <button 
          onClick={toggleDarkMode}
          className="text-gray-400 hover:text-cyan-500 transition-colors" 
          title="Dark/Light Modus"
        >
          {darkMode ? (
            <span className="material-icons text-2xl">light_mode</span>
          ) : (
            <span className="material-icons text-2xl">dark_mode</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
