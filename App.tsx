import React, { useState, useEffect } from 'react';
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
import { createUGTAuthClient, UGTAuthClient } from './lib/ugt-auth-client';

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
    <BrowserRouter>
      <div className="bg-transparent text-zinc-800 antialiased">
        <Header onOpenIdModal={openIdModal} />
        <main id="main-content">
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
            <Route path="/verify/:uid" element={<VerificationPage />} />
            <Route path="/auth/callback" element={<VerificationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <UniversalIdPortal isModal isOpen={isIdModalOpen} onClose={closeIdModal} authClient={authClient} />
      </div>
    </BrowserRouter>
  );
};

export default App;