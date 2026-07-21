import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import GratitudeSection from './components/GratitudeSection';
import EssenceSection from './components/EssenceSection';
import MissionSection from './components/MissionSection';
import InitiativesSection from './components/InitiativesSection';
import CollaborationSection from './components/CollaborationSection';
import UniversalIdPortal from './components/UniversalIdPortal';
import FounderSection from './components/FounderSection';
import CoFounderSection from './components/CoFounderSection';
import SupportersSection from './components/SupportersSection';
import Footer from './components/ContactSection';
import FadeIn from './components/FadeIn';
import VerificationPage from './components/VerificationPage';
import { PasswordResetRequest } from './components/PasswordResetRequest';
import { PasswordResetConfirm } from './components/PasswordResetConfirm';
import { createUGTAuthClient, UGTAuthClient } from './lib/ugt-auth-client';
import ErrorBoundary, { setupGlobalErrorHandlers } from './components/ErrorBoundary';
import HealthCheck from './components/HealthCheck';

// Lazy load heavy components for performance
const LazyVerificationPage = lazy(() => import('./components/VerificationPage'));
const LazyPasswordResetRequest = lazy(() => 
  import('./components/PasswordResetRequest').then(m => ({ default: m.PasswordResetRequest }))
);
const LazyPasswordResetConfirm = lazy(() => 
  import('./components/PasswordResetConfirm').then(m => ({ default: m.PasswordResetConfirm }))
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
                    <HeroSection onOpenIdModal={openIdModal} />
                    <FadeIn><GratitudeSection /></FadeIn>
                    <EssenceSection />
                    <MissionSection />
                    <InitiativesSection />
                    <CollaborationSection />
                    <FadeIn><UniversalIdPortal authClient={authClient} /></FadeIn>
                    <FadeIn><FounderSection /></FadeIn>
                    <FadeIn><CoFounderSection /></FadeIn>
                    <FadeIn><SupportersSection /></FadeIn>
                    <Footer />
                  </>
                )} />
                <Route path="/verify/:uid" element={<LazyVerificationPage />} />
                <Route path="/auth/callback" element={<LazyVerificationPage />} />
                <Route path="/password-reset" element={<LazyPasswordResetRequest onBackToLogin={() => window.history.back()} />} />
                <Route path="/password-reset/confirm/:token" element={<LazyPasswordResetConfirm onBackToLogin={() => window.history.back()} />} />
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