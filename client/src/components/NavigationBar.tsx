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

  // Handle click on conspiracy theories link
  const handleConspiracyClick = (e: React.MouseEvent) => {
    if (isActive('/conspiracy-theories')) {
      e.preventDefault();
      onShowSearchField();
    }
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
    <div className="fixed top-0 right-0 h-full w-16 bg-white shadow-lg z-40 flex flex-col items-center py-6 border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <Link 
        href="/" 
        className={`mb-10 transition-colors ${isActive('/') ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'}`} 
        title="Home"
      >
        <span className="material-icons text-2xl">home</span>
      </Link>
      
      <Link 
        href="/conspiracy-theories" 
        className={`transition-colors ${isActive('/conspiracy-theories') ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'}`} 
        title="Verschwörungstheorien"
        onClick={handleConspiracyClick}
      >
        <span className="material-icons text-2xl">psychology</span>
      </Link>
      
      <Link 
        href="/categories" 
        className={`mt-6 transition-colors ${isActive('/categories') ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'}`} 
        title="Verschwörungskategorien"
      >
        <span className="material-icons text-2xl">category</span>
      </Link>
      
      <div className="mt-auto flex flex-col items-center space-y-6">
        <button 
          onClick={handleAuthClick}
          className="text-gray-400 hover:text-primary-600 transition-colors" 
          title="Login"
        >
          <span className="material-icons text-2xl">person</span>
        </button>
        
        <button 
          onClick={toggleDarkMode}
          className="text-gray-400 hover:text-primary-600 transition-colors" 
          title="Dark Mode Toggle"
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
