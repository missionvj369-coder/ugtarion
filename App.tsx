import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import GratitudeSection from './components/GratitudeSection';
import EssenceSection from './components/EssenceSection';
import MissionSection from './components/MissionSection';
import InitiativesSection from './components/InitiativesSection';
import CollaborationSection from './components/CollaborationSection';
import RegistrySection from './components/RegistrySection';
import FounderSection from './components/FounderSection';
import CoFounderSection from './components/CoFounderSection';
import SupportersSection from './components/SupportersSection';
import Footer from './components/ContactSection';
import FadeIn from './components/FadeIn';
import UniversalIdModal from './components/UniversalIdModal';

const App: React.FC = () => {
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);

  const openIdModal = () => setIsIdModalOpen(true);
  const closeIdModal = () => setIsIdModalOpen(false);

  return (
    <div className="bg-transparent text-zinc-800 antialiased">
      <Header onOpenIdModal={openIdModal} />
      <main>
        <HeroSection onOpenIdModal={openIdModal} />
        <FadeIn><GratitudeSection /></FadeIn>
        <EssenceSection />
        <MissionSection />
        <InitiativesSection />
        <CollaborationSection />
        <FadeIn><RegistrySection /></FadeIn>
        <FadeIn><FounderSection /></FadeIn>
        <FadeIn><CoFounderSection /></FadeIn>
        <FadeIn><SupportersSection /></FadeIn>
        <Footer />
      </main>
      <UniversalIdModal isOpen={isIdModalOpen} onClose={closeIdModal} />
    </div>
  );
};

export default App;