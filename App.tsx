import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const VisionPage = lazy(() => import('./pages/VisionPage'));
const BlueprintPage = lazy(() => import('./pages/BlueprintPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AboutUGTPage = lazy(() => import('./pages/AboutUGTPage'));
const HumanEvolutionPage = lazy(() => import('./pages/HumanEvolutionPage'));
const IntegratedIntelligencePage = lazy(() => import('./pages/IntegratedIntelligencePage'));
const HeavenOnEarthPage = lazy(() => import('./pages/HeavenOnEarthPage'));
const UniversalIdPage = lazy(() => import('./pages/UniversalIdPage'));
const HumanPage = lazy(() => import('./pages/HumanPage'));
const ConsciousnessPage = lazy(() => import('./pages/ConsciousnessPage'));
const IntelligencePage = lazy(() => import('./pages/IntelligencePage'));
const CivilizationPage = lazy(() => import('./pages/CivilizationPage'));
const CreationPage = lazy(() => import('./pages/CreationPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const JoinPage = lazy(() => import('./pages/JoinPage'));
const SystemsPage = lazy(() => import('./pages/SystemsPage'));
const KnowledgePage = lazy(() => import('./pages/KnowledgePage'));
const QuestionsPage = lazy(() => import('./pages/QuestionsPage'));
const MediaPage = lazy(() => import('./pages/MediaPage'));
const KnowledgeHumanEvolutionPage = lazy(() => import('./pages/KnowledgeHumanEvolutionPage'));
const KnowledgeIntegratedIntelligencePage = lazy(() => import('./pages/KnowledgeIntegratedIntelligencePage'));
const KnowledgeHumanFlourishingPage = lazy(() => import('./pages/KnowledgeHumanFlourishingPage'));
const KnowledgeCivilizationTransformationPage = lazy(() => import('./pages/KnowledgeCivilizationTransformationPage'));
const KnowledgeHeavenOnEarthPage = lazy(() => import('./pages/KnowledgeHeavenOnEarthPage'));
const KnowledgeUniversalIdPage = lazy(() => import('./pages/KnowledgeUniversalIdPage'));
const KnowledgeConsciousCivilizationPage = lazy(() => import('./pages/KnowledgeConsciousCivilizationPage'));
const KnowledgeTechnologyAndHumanFlourishingPage = lazy(() => import('./pages/KnowledgeTechnologyAndHumanFlourishingPage'));
const KnowledgeFutureOfCivilizationPage = lazy(() => import('./pages/KnowledgeFutureOfCivilizationPage'));
const QuestionHeavenOnEarthPage = lazy(() => import('./pages/QuestionHeavenOnEarthPage'));
const QuestionIntegratedIntelligencePage = lazy(() => import('./pages/QuestionIntegratedIntelligencePage'));
const QuestionHumanFlourishingPage = lazy(() => import('./pages/QuestionHumanFlourishingPage'));
const QuestionBetterCivilizationPage = lazy(() => import('./pages/QuestionBetterCivilizationPage'));
const QuestionTechnologyPage = lazy(() => import('./pages/QuestionTechnologyPage'));
const QuestionNaturePage = lazy(() => import('./pages/QuestionNaturePage'));
const QuestionConsciousCivilizationPage = lazy(() => import('./pages/QuestionConsciousCivilizationPage'));
const MediaMusicPage = lazy(() => import('./pages/MediaMusicPage'));
const MediaPodcastsPage = lazy(() => import('./pages/MediaPodcastsPage'));
const MediaVideosPage = lazy(() => import('./pages/MediaVideosPage'));
const MediaFilmsPage = lazy(() => import('./pages/MediaFilmsPage'));

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

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

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
        <ScrollToTop />
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
                <Route path="/about-universal-guard-trust" element={withFooter(<AboutUGTPage />)} />
                <Route path="/about" element={withFooter(<AboutPage />)} />
                <Route path="/vision" element={withFooter(<VisionPage onOpenIdModal={openIdModal} />)} />
                <Route path="/blueprint" element={withFooter(<BlueprintPage onOpenIdModal={openIdModal} />)} />
                <Route path="/systems" element={withFooter(<SystemsPage onOpenIdModal={openIdModal} />)} />
                <Route path="/human-evolution" element={withFooter(<HumanEvolutionPage />)} />
                <Route path="/integrated-intelligence" element={withFooter(<IntegratedIntelligencePage />)} />
                <Route path="/heaven-on-earth" element={withFooter(<HeavenOnEarthPage />)} />
                <Route path="/heaven-on-earth/blueprint" element={withFooter(<BlueprintPage onOpenIdModal={openIdModal} />)} />
                <Route path="/universal-id" element={withFooter(<UniversalIdPage onOpenIdModal={openIdModal} />)} />
                <Route path="/conscious-civilization" element={withFooter(<ConsciousnessPage onOpenIdModal={openIdModal} />)} />
                <Route path="/civilization-transformation" element={withFooter(<CivilizationPage onOpenIdModal={openIdModal} />)} />
                <Route path="/civilization" element={<Navigate to="/civilization-transformation" replace />} />
                <Route path="/creation" element={withFooter(<CreationPage onOpenIdModal={openIdModal} />)} />
                <Route path="/projects" element={withFooter(<ProjectsPage onOpenIdModal={openIdModal} />)} />
                <Route path="/join" element={withFooter(<JoinPage onOpenIdModal={openIdModal} />)} />
                <Route path="/knowledge" element={withFooter(<KnowledgePage />)} />
                <Route path="/knowledge/human-evolution" element={withFooter(<KnowledgeHumanEvolutionPage />)} />
                <Route path="/knowledge/integrated-intelligence" element={withFooter(<KnowledgeIntegratedIntelligencePage />)} />
                <Route path="/knowledge/human-flourishing" element={withFooter(<KnowledgeHumanFlourishingPage />)} />
                <Route path="/knowledge/civilization-transformation" element={withFooter(<KnowledgeCivilizationTransformationPage />)} />
                <Route path="/knowledge/heaven-on-earth" element={withFooter(<KnowledgeHeavenOnEarthPage />)} />
                <Route path="/knowledge/universal-id" element={withFooter(<KnowledgeUniversalIdPage />)} />
                <Route path="/knowledge/conscious-civilization" element={withFooter(<KnowledgeConsciousCivilizationPage />)} />
                <Route path="/knowledge/technology-and-human-flourishing" element={withFooter(<KnowledgeTechnologyAndHumanFlourishingPage />)} />
                <Route path="/knowledge/future-of-civilization" element={withFooter(<KnowledgeFutureOfCivilizationPage />)} />
                <Route path="/questions" element={withFooter(<QuestionsPage />)} />
                <Route path="/questions/can-humanity-create-heaven-on-earth" element={withFooter(<QuestionHeavenOnEarthPage />)} />
                <Route path="/questions/what-is-integrated-intelligence" element={withFooter(<QuestionIntegratedIntelligencePage />)} />
                <Route path="/questions/what-does-human-flourishing-mean" element={withFooter(<QuestionHumanFlourishingPage />)} />
                <Route path="/questions/what-would-a-better-civilization-look-like" element={withFooter(<QuestionBetterCivilizationPage />)} />
                <Route path="/questions/how-can-technology-improve-human-life" element={withFooter(<QuestionTechnologyPage />)} />
                <Route path="/questions/how-can-humanity-live-in-harmony-with-nature" element={withFooter(<QuestionNaturePage />)} />
                <Route path="/questions/what-is-conscious-civilization" element={withFooter(<QuestionConsciousCivilizationPage />)} />
                <Route path="/media" element={withFooter(<MediaPage />)} />
                <Route path="/media/music" element={withFooter(<MediaMusicPage />)} />
                <Route path="/media/podcasts" element={withFooter(<MediaPodcastsPage />)} />
                <Route path="/media/videos" element={withFooter(<MediaVideosPage />)} />
                <Route path="/media/films" element={withFooter(<MediaFilmsPage />)} />
                <Route path="/human" element={<Navigate to="/human-evolution" replace />} />
                <Route path="/intelligence" element={<Navigate to="/integrated-intelligence" replace />} />
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