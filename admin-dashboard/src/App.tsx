import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectsProvider } from './context/ProjectsContext';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return user ? (
    <ProjectsProvider>
      <DashboardPage />
    </ProjectsProvider>
  ) : (
    <LoginPage />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
