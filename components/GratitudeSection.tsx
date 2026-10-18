import React from 'react';
import { GRATITUDE_DECLARATION } from '../constants';
import SectionWrapper from './SectionWrapper';
import FadeIn from './FadeIn';

const GratitudeSection: React.FC = () => {
  return (
    <SectionWrapper>
      <FadeIn>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs sm:text-sm font-semibold text-zinc-900 tracking-[0.2em] uppercase mb-4">
            With Gratitude
          </p>
          <span aria-hidden className="mx-auto mb-8 block h-px w-12 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
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