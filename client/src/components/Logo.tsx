import React from 'react';
import { Link } from 'wouter';

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <a className="flex items-center">
        <div className="w-10 h-10 rounded-lg bg-primary-600 text-white flex items-center justify-center mr-3">
          <span className="material-icons">hub</span>
        </div>
        <h1 className="text-2xl font-semibold">VeriForum</h1>
      </a>
    </Link>
  );
};

export default Logo;
