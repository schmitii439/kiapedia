import React, { useState } from 'react';
import Logo from '@/components/Logo';
import NavigationBar from '@/components/NavigationBar';
import SearchField from '@/components/SearchField';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [searchFieldVisible, setSearchFieldVisible] = useState(false);

  // Show search field
  const handleShowSearchField = () => {
    setSearchFieldVisible(true);
  };

  // Hide search field
  const handleCloseSearchField = () => {
    setSearchFieldVisible(false);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Main content area */}
      <div className="flex-1 pl-4 pr-20">
        {/* Logo */}
        <div className="py-4 px-2">
          <Logo />
        </div>
        
        {/* Page content */}
        <main>
          {children}
        </main>
      </div>

      {/* Vertical navigation bar */}
      <NavigationBar onShowSearchField={handleShowSearchField} />

      {/* Search field */}
      <SearchField 
        isVisible={searchFieldVisible} 
        onClose={handleCloseSearchField} 
      />
    </div>
  );
};

export default MainLayout;
