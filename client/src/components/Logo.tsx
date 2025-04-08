import React from 'react';
import { Link } from 'wouter';
import kiapediaLogo from '@assets/kiapedia-logo.png';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center group">
      <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-cyan-500/30 transition-all group-hover:border-cyan-400/70 shadow-md">
        <img src={kiapediaLogo} alt="KIAPEDIA Logo" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors">KIAPEDIA</h1>
        <p className="text-xs italic text-gray-400 -mt-1">... ich hab mies recherchiert!</p>
      </div>
    </Link>
  );
};

export default Logo;
