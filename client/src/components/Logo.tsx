import React from 'react';
import { Link } from 'wouter';
import kiapediaLogo from '@assets/kiapedia-logo.png';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center group">
      <div className="w-16 h-16 rounded-full overflow-hidden mr-3 border-2 border-cyan-500/30 transition-all duration-300 
                    group-hover:border-cyan-400/70 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] group-hover:scale-110 shadow-md">
        <img 
          src={kiapediaLogo} 
          alt="KIAPEDIA Logo" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-black tracking-wide transition-colors duration-300">KIAPEDIA</h1>
        <p className="text-xs italic text-gray-400 -mt-1 opacity-0 transform -translate-y-1 transition-all duration-300 
                      group-hover:opacity-100 group-hover:translate-y-0">
          ... ich hab mies recherchiert!
        </p>
      </div>
    </Link>
  );
};

export default Logo;
