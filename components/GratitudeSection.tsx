import React from 'react';
import { GRATITUDE_DECLARATION } from '../constants';
import SectionWrapper from './SectionWrapper';
import FadeIn from './FadeIn';

const GratitudeSection: React.FC = () => {
  return (
    <SectionWrapper>
      <FadeIn>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs sm:text-sm font-semibold text-zinc-500 tracking-[0.2em] uppercase mb-8">
            With Gratitude
          </p>
          <div className="space-y-5 text-zinc-700/90 text-sm sm:text-base md:text-lg font-light leading-relaxed">
            {GRATITUDE_DECLARATION.map((paragraph, index) => (
              <p key={index} className="font-light">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
};

export default GratitudeSection;