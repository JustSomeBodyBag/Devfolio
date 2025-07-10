import React, { useState } from 'react';
import Projects from '../components/Dashboard/Projects';
import Analytics from '../components/Dashboard/Analytics';
import Settings from '../components/Dashboard/Settings';
import HomePageContentEditor from '../components/Dashboard/HomePageContent';
import LayoutWrapper from '../components/Layout/LayoutWrapper';

type Section = 'projects' | 'analytics' | 'settings' | 'homepage';

const DashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('projects');

  const renderContent = () => {
    switch (activeSection) {
      case 'projects':
        return <Projects />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'homepage':
        return <HomePageContentEditor />;
      default:
        return null;
    }
  };

  const handleSelect = (section: string) => {
    if (section === 'projects' || section === 'analytics' || section === 'settings' || section === 'homepage') {
      setActiveSection(section);
    }
  };

  return (
    <LayoutWrapper activeSection={activeSection} onSelect={handleSelect}>
      {renderContent()}
    </LayoutWrapper>
  );
};

export default DashboardPage;
