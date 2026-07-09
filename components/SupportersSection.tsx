
import React from 'react';
import { SUPPORTERS_DATA, SUPPORTERS_SECTION_DATA } from '../constants';
import SectionWrapper from './SectionWrapper';
import FadeIn from './FadeIn';

const SupportersSection: React.FC = () => {
  return (
    <SectionWrapper className="bg-zinc-50/70">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-left mb-20">
            <h2 className="text-3xl sm:text-4xl font-medium">{SUPPORTERS_SECTION_DATA.title}</h2>
            <p className="mt-4 text-lg text-zinc-600 font-light">{SUPPORTERS_SECTION_DATA.subtitle}</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUPPORTERS_DATA.map((supporter, index) => (
            <FadeIn key={index} delay={index * 100}>
              <div className="relative flex flex-col h-full bg-white p-8 rounded-lg shadow-sm">
                <blockquote className="text-lg text-zinc-800 font-light leading-relaxed flex-grow relative pl-2">
                  <span className="text-4xl text-zinc-300/80 font-serif absolute left-0 -translate-x-full -translate-y-2 top-0">“</span>
                  {supporter.message}
                </blockquote>
                <div className="mt-6 pt-6 border-t border-zinc-200/80 flex items-center gap-4">
                  <img 
                    src={supporter.avatar}
                    alt={`Avatar for ${supporter.name}`}
                    className="w-14 h-14 rounded-full object-cover bg-zinc-200 border-2 border-white ring-1 ring-zinc-200"
                  />
                  <div>
                    <p className="font-semibold text-zinc-900">{supporter.name}</p>
                    {/* Removed supporter.title as per user request */}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default SupportersSection;
