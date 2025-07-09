import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutWrapperProps {
  activeSection: string;
  onSelect: (section: string) => void;
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ activeSection, onSelect, children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar activeSection={activeSection} onSelect={onSelect} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
