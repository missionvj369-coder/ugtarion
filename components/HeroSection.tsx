import React from 'react';
import { HERO_DATA } from '../constants';
import { ScrollIndicatorIcon } from './icons';

interface HeroSectionProps {
  onOpenIdModal: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenIdModal }) => {
  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen flex items-center justify-center text-center py-20 px-6 sm:px-8 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAF9FA] to-[#FCFCFC]"
    >
      {/* Soft static premium gradient halos */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-100/30 to-amber-100/30 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[30rem] h-[30rem] rounded-full bg-gradient-to-bl from-amber-50/20 via-indigo-50/20 to-transparent blur-3xl opacity-50 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tighter leading-tight sm:leading-tight md:leading-tight text-zinc-900">
          {HERO_DATA.headline}
        </h1>
        <p className="mt-8 text-lg sm:text-xl text-zinc-650 max-w-4xl mx-auto font-light leading-relaxed">
          {HERO_DATA.subheadline}
        </p>
        <div className="mt-16">
          <button
            onClick={onOpenIdModal}
            className="inline-block bg-zinc-900 text-white font-medium px-10 py-4 text-base sm:text-lg tracking-wider uppercase rounded-full transition-transform hover:scale-105 shadow-lg shadow-zinc-900/10 active:scale-95"
          >
            Claim Your Universal ID
          </button>
        </div>
      </div>
       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <ScrollIndicatorIcon className="w-6 h-6 text-zinc-400 animate-bounce-slow" />
      </div>
    </section>
  );
};

export default HeroSection;