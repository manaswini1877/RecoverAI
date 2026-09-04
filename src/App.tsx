import React, { useState, useEffect } from 'react';
import { RecoveryProvider } from './context/RecoveryContext';
import { LandingPage } from './pages/LandingPage';
import { GuidedDemoPage } from './pages/GuidedDemoPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardShell } from './components/DashboardShell';
import { OverviewPage } from './pages/OverviewPage';
import { AgentCheckoutPage } from './pages/AgentCheckoutPage';
import { AgentsPage } from './pages/AgentsPage';
import { CasesPage } from './pages/CasesPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { LiveAgentPage } from './pages/LiveAgentPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { CustomersPage } from './pages/CustomersPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Rendering Logic
  const renderContent = () => {
    // Public routes
    if (currentPath === '/' || currentPath === '') {
      return <LandingPage onNavigate={navigateTo} />;
    }

    if (currentPath === '/demo') {
      return <GuidedDemoPage onNavigate={navigateTo} />;
    }

    if (currentPath === '/login') {
      return (
        <LoginPage
          onLogin={() => navigateTo('/app/overview')}
          onNavigateHome={() => navigateTo('/')}
        />
      );
    }

    // Authenticated / Dashboard Shell routes
    if (currentPath.startsWith('/app')) {
      let pageComponent: React.ReactNode;

      if (currentPath.startsWith('/app/cases/')) {
        const caseId = currentPath.replace('/app/cases/', '');
        pageComponent = <CaseDetailPage caseId={caseId} onNavigate={navigateTo} />;
      } else {
        switch (currentPath) {
          case '/app/agent-checkout':
            pageComponent = <AgentCheckoutPage onNavigate={navigateTo} />;
            break;
          case '/app/agents':
            pageComponent = <AgentsPage />;
            break;
          case '/app/cases':
            pageComponent = <CasesPage onNavigate={navigateTo} />;
            break;
          case '/app/live-agent':
            pageComponent = <LiveAgentPage onNavigate={navigateTo} />;
            break;
          case '/app/analytics':
            pageComponent = <AnalyticsPage />;
            break;
          case '/app/policies':
            pageComponent = <PoliciesPage />;
            break;
          case '/app/customers':
            pageComponent = <CustomersPage />;
            break;
          case '/app/integrations':
            pageComponent = <IntegrationsPage />;
            break;
          case '/app/settings':
            pageComponent = <SettingsPage />;
            break;
          case '/app/overview':
          default:
            pageComponent = <OverviewPage onNavigate={navigateTo} />;
            break;
        }
      }

      return (
        <DashboardShell currentPath={currentPath} onNavigate={navigateTo}>
          {pageComponent}
        </DashboardShell>
      );
    }

    // Default fallback to Landing Page
    return <LandingPage onNavigate={navigateTo} />;
  };

  return <RecoveryProvider>{renderContent()}</RecoveryProvider>;
};

export default App;
