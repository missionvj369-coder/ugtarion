import React from 'react';
import { GRATITUDE_DECLARATION } from '../constants';
import SectionWrapper from './SectionWrapper';

const GratitudeSection: React.FC = () => {
  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-10 text-3xl sm:text-4xl md:text-5xl text-zinc-700/90 font-serif font-medium leading-relaxed sm:leading-relaxed md:leading-loose">
          {GRATITUDE_DECLARATION.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default GratitudeSection;