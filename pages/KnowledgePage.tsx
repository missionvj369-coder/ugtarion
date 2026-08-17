import React, { useEffect } from 'react';
import { PageHero, ContentSection, P, PillarGrid, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const KnowledgePage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'UGT Knowledge Library — Integrated Intelligence & Human Evolution',
      'Explore the foundational concepts of the Universal Guard Trust (UGT), from human evolution and integrated intelligence to the transformation of civilization.'
    );
  }, []);

  const cornerstonePages = [
    {
      title: 'Human Evolution',
      description: 'Exploring the conscious advancement of human capacity and the transition to new stages of existence.',
      path: '/knowledge/human-evolution'
    },
    {
      title: 'Integrated Intelligence',
      description: 'The synthesis of human intuition, artificial intelligence, and collective wisdom into a unified system.',
      path: '/knowledge/integrated-intelligence'
    },
    {
      title: 'Human Flourishing',
      description: 'Defining the conditions for the highest potential of human physical, mental, and spiritual existence.',
      path: '/knowledge/human-flourishing'
    },
    {
      title: 'Civilization Transformation',
      description: 'The systemic shift toward a conscious, transparent, and empathetic global society.',
      path: '/knowledge/civilization-transformation'
    },
    {
      title: 'Heaven on Earth',
      description: 'The practical vision of manifesting peace, abundance, and harmony in the physical realm.',
      path: '/knowledge/heaven-on-earth'
    },
    {
      title: 'Universal ID',
      description: 'The sovereign identity layer enabling equitable participation in the UGT ecosystem.',
      path: '/knowledge/universal-id'
    },
    {
      title: 'Conscious Civilization',
      description: 'Understanding the principles of a society aligned with systemic intelligence and planetary health.',
      path: '/knowledge/conscious-civilization'
    },
    {
      title: 'Technology & Flourishing',
      description: 'How advanced technology can be leveraged to enhance rather than replace the human experience.',
      path: '/knowledge/technology-and-human-flourishing'
    },
    {
      title: 'Future of Civilization',
      description: 'Mapping the trajectory of human development in the age of integrated intelligence.',
      path: '/knowledge/future-of-civilization'
    },
  ];

  return (
    <div className="bg-white">
      <PageHero 
        title="Knowledge Library" 
        subtitle="A curated collection of foundational concepts and architectural visions driving the Universal Guard Trust framework."
      />

      <ContentSection 
        eyebrow="Foundations" 
        title="Cornerstone Concepts" 
        lead="These pages define the core intellectual framework of UGT, bridging established knowledge with our vision for the future."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cornerstonePages.map((page, i) => (
            <a 
              key={page.title} 
              href={page.path} 
              className="block h-full rounded-2xl border border-zinc-200/70 bg-white/60 backdrop-blur-sm p-6 sm:p-8 hover:border-zinc-400 transition-all duration-300 hover:shadow-sm group"
            >
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3 group-hover:text-indigo-500 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h4 className="text-base sm:text-lg font-medium text-zinc-900 mb-2 group-hover:text-zinc-800">{page.title}</h4>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">{page.description}</p>
            </a>
          ))}
        </div>
      </ContentSection>

      <ContentSection 
        center 
        title="Deepen Your Understanding" 
        lead="The Knowledge Library is an evolving body of work. Every concept is interconnected, forming a semantic network of human and integrated intelligence."
      >
        <div className="max-w-3xl mx-auto text-center">
          <P className="mb-8">
            To understand the broader context of these concepts, we invite you to visit the central entity hub.
          </P>
          <div className="flex justify-center">
            <a 
              href="/about-universal-guard-trust" 
              className="inline-flex items-center justify-center font-medium px-8 py-3.5 text-sm tracking-wider uppercase rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-300"
            >
              About Universal Guard Trust
            </a>
          </div>
        </div>
      </ContentSection>

      <CTASection 
        title="Have Questions?" 
        subtitle="Explore our human-centric answers to the most pressing questions about our future."
        primaryLabel="Visit Questions"
        primaryTo="/questions"
        secondaryLabel="Join UGT"
        secondaryTo="/join"
      />
    </div>
  );
};

export default KnowledgePage;