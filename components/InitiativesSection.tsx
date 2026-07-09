import React from 'react';
import { CURRENT_INITIATIVES } from '../constants';
import SectionWrapper from './SectionWrapper';
import FadeIn from './FadeIn';

const InitiativesSection: React.FC = () => {
  return (
    <SectionWrapper>
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-left mb-20">
            <h2 className="text-3xl sm:text-4xl font-medium">{CURRENT_INITIATIVES.title}</h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {CURRENT_INITIATIVES.points.map((point, index) => (
            <FadeIn key={index} delay={index * 100}>
              <div className="flex items-start gap-6">
                <span className="font-mono text-zinc-500 mt-1">{String(index + 1).padStart(2, '0')}</span>
                <p className="flex-1 text-xl text-zinc-700 font-light">{point}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default InitiativesSection;