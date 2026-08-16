import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/ContactSection';
import UniversalIdPortal from './components/UniversalIdPortal';
import { PasswordResetRequest } from './components/PasswordResetRequest';
import { PasswordResetConfirm } from './components/PasswordResetConfirm';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import FAQ from './components/FAQ';
import { createUGTAuthClient, UGTAuthClient } from './lib/ugt-auth-client';
import ErrorBoundary, { setupGlobalErrorHandlers } from './components/ErrorBoundary';
import HealthCheck from './components/HealthCheck';
import HomePage from './pages/HomePage';
import VisionPage from './pages/VisionPage';
import BlueprintPage from './pages/BlueprintPage';
import AboutPage from './pages/AboutPage';
import HumanEvolutionPage from './pages/HumanEvolutionPage';
import IntegratedIntelligencePage from './pages/IntegratedIntelligencePage';
import HeavenOnEarthPage from './pages/HeavenOnEarthPage';
import UniversalIdPage from './pages/UniversalIdPage';
import HumanPage from './pages/HumanPage';
import ConsciousnessPage from './pages/ConsciousnessPage';
import IntelligencePage from './pages/IntelligencePage';
import CivilizationPage from './pages/CivilizationPage';
import CreationPage from './pages/CreationPage';
import ProjectsPage from './pages/ProjectsPage';
import JoinPage from './pages/JoinPage';
import SystemsPage from './pages/SystemsPage';

// Lazy load heavy components for performance
const LazyVerificationPage = lazy(() => import('./components/VerificationPage'));
const LazyPasswordResetRequest = lazy(() => 
  import('./components/PasswordResetRequest').then(m => ({ default: m.PasswordResetRequest }))
);

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-400 text-sm">Loading...</p>
    </div>
  </div>
);

// Setup global error handlers on app load
if (typeof window !== 'undefined') {
  setupGlobalErrorHandlers();
}

const App: React.FC = () => {
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [authClient, setAuthClient] = useState<UGTAuthClient | null>(null);

  const openIdModal = () => setIsIdModalOpen(true);
  const closeIdModal = () => setIsIdModalOpen(false);

  // Initialize UGT Auth Client
  useEffect(() => {
    const client = createUGTAuthClient({
      authDomain: import.meta.env.VITE_AUTH_DOMAIN || 'auth.ugt.org',
      clientId: import.meta.env.VITE_PLATFORM_CLIENT_ID || 'ugt_portal_client',
      redirectUri: import.meta.env.VITE_PLATFORM_REDIRECT_URI || `${window.location.origin}/auth/callback`,
      scope: 'profile email rankings',
      usePKCE: true,
    });
    setAuthClient(client);
  }, []);

  // Make authClient available globally for UniversalIdPortal
  useEffect(() => {
    if (authClient) {
      (window as any).__UGT_AUTH_CLIENT__ = authClient;
    }
  }, [authClient]);

  const withFooter = (page: React.ReactNode) => (
    <>
      {page}
      <Footer />
    </>
  );

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="bg-transparent text-zinc-800 antialiased">
          <Header onOpenIdModal={openIdModal} />
          <main id="main-content">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={(
                  <>
                    <HomePage onOpenIdModal={openIdModal} />
                    <Footer />
                  </>
                )} />
                <Route path="/vision" element={withFooter(<VisionPage onOpenIdModal={openIdModal} />)} />
                <Route path="/blueprint" element={withFooter(<BlueprintPage onOpenIdModal={openIdModal} />)} />
                <Route path="/about" element={withFooter(<AboutPage />)} />
                <Route path="/systems" element={withFooter(<SystemsPage onOpenIdModal={openIdModal} />)} />
                <Route path="/human-evolution" element={withFooter(<HumanEvolutionPage />)} />
                <Route path="/integrated-intelligence" element={withFooter(<IntegratedIntelligencePage />)} />
                <Route path="/heaven-on-earth" element={withFooter(<HeavenOnEarthPage />)} />
                <Route path="/universal-id" element={withFooter(<UniversalIdPage onOpenIdModal={openIdModal} />)} />
                <Route path="/human" element={<Navigate to="/human-evolution" replace />} />
                <Route path="/intelligence" element={<Navigate to="/integrated-intelligence" replace />} />
                <Route path="/consciousness" element={withFooter(<ConsciousnessPage onOpenIdModal={openIdModal} />)} />
                <Route path="/civilization" element={withFooter(<CivilizationPage onOpenIdModal={openIdModal} />)} />
                <Route path="/creation" element={withFooter(<CreationPage onOpenIdModal={openIdModal} />)} />
                <Route path="/projects" element={withFooter(<ProjectsPage onOpenIdModal={openIdModal} />)} />
                <Route path="/join" element={withFooter(<JoinPage onOpenIdModal={openIdModal} />)} />
                <Route path="/verify/:uid" element={<LazyVerificationPage />} />
                <Route path="/auth/callback" element={<LazyVerificationPage />} />
                <Route path="/password-reset" element={<LazyPasswordResetRequest onBackToLogin={() => window.history.back()} />} />
                <Route path="/password-reset/confirm" element={<PasswordResetConfirm onBackToLogin={() => window.history.back()} />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <UniversalIdPortal isModal isOpen={isIdModalOpen} onClose={closeIdModal} authClient={authClient} />
          <HealthCheck apiUrl={`${import.meta.env.VITE_API_BASE_URL || ''}/health`} checkInterval={30000} />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;