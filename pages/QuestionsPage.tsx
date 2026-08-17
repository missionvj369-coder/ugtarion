import React, { useEffect } from 'react';
import { PageHero, ContentSection, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const QuestionsPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'UGT Human Questions — Exploring the Future of Civilization',
      'Direct answers to the most fundamental questions about human evolution, integrated intelligence, and the possibility of creating heaven on earth.'
    );
  }, []);

  const questions = [
    {
      question: 'Can humanity create Heaven on Earth?',
      path: '/questions/can-humanity-create-heaven-on-earth',
      category: 'Vision'
    },
    {
      question: 'What is Integrated Intelligence?',
      path: '/questions/what-is-integrated-intelligence',
      category: 'Intelligence'
    },
    {
      question: 'What does Human Flourishing mean?',
      path: '/questions/what-does-human-flourishing-mean',
      category: 'Evolution'
    },
    {
      question: 'What would a better civilization look like?',
      path: '/questions/what-would-a-better-civilization-look-like',
      category: 'Civilization'
    },
    {
      question: 'How can technology improve human life?',
      path: '/questions/how-can-technology-improve-human-life',
      category: 'Technology'
    },
    {
      question: 'How can humanity live in harmony with nature?',
      path: '/questions/how-can-humanity-live-in-harmony-with-nature',
      category: 'Nature'
    },
    {
      question: 'What is Conscious Civilization?',
      path: '/questions/what-is-conscious-civilization',
      category: 'Civilization'
    },
  ];

  return (
    <div className="bg-white">
      <PageHero 
        title="Human Questions" 
        subtitle="Seeking clarity on the most profound challenges and possibilities of our collective future."
      />

      <ContentSection 
        eyebrow="Inquiry" 
        title="Fundamental Questions" 
        lead="We believe that the path to transformation begins with the right questions. Here we explore the intersections of technology, consciousness, and civilization."
      >
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          {questions.map((q, i) => (
            <a 
              key={q.path} 
              href={q.path} 
              className="group block p-6 rounded-2xl border border-zinc-200 hover:border-indigo-400 transition-all duration-300 bg-white hover:bg-zinc-50"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2 block">
                    {q.category}
                  </span>
                  <h4 className="text-lg sm:text-xl font-light text-zinc-900 group-hover:text-zinc-800 transition-colors">
                    {q.question}
                  </h4>
                </div>
                <span className="text-zinc-300 group-hover:text-indigo-500 transition-colors text-2xl">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </ContentSection>

      <ContentSection 
        center 
        title="The Dialogue of Evolution" 
        lead="These answers are not static truths, but starting points for a deeper dialogue about where we are going as a species."
      >
        <div className="max-w-3xl mx-auto text-center">
          <P className="mb-8">
            For a deeper dive into the theoretical frameworks behind these answers, explore our Knowledge Library.
          </P>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/knowledge" 
              className="inline-flex items-center justify-center font-medium px-8 py-3.5 text-sm tracking-wider uppercase rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-300"
            >
              Knowledge Library
            </a>
            <a 
              href="/about-universal-guard-trust" 
              className="inline-flex items-center justify-center font-medium px-8 py-3.5 text-sm tracking-wider uppercase rounded-full border border-zinc-300 text-zinc-800 hover:bg-zinc-50 transition-all duration-300"
            >
              About UGT
            </a>
          </div>
        </div>
      </ContentSection>

      <CTASection 
        title="Ready to Participate?" 
        subtitle="Join a global community dedicated to the conscious transformation of civilization."
        primaryLabel="Join UGT"
        primaryTo="/join"
        secondaryLabel="Explore Projects"
        secondaryTo="/projects"
      />
    </div>
  );
};

export default QuestionsPage;