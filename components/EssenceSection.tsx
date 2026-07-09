import React from 'react';
import { UGT_ESSENCE } from '../constants';
import SectionWrapper from './SectionWrapper';
import FadeIn from './FadeIn';

const EssenceSection: React.FC = () => {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <FadeIn>
          <div className="md:col-span-1">
            <h2 className="text-sm font-semibold text-zinc-600 tracking-widest uppercase">{UGT_ESSENCE.title}</h2>
            <p className="mt-4 text-3xl sm:text-4xl font-medium tracking-tight">{UGT_ESSENCE.subtitle}</p>
          </div>
        </FadeIn>
        <div className="md:col-span-2 space-y-10">
          {UGT_ESSENCE.points.map((point, index) => (
            <FadeIn key={index} delay={index * 100}>
              <div className="flex items-start gap-6">
                <div className="w-4 h-4 mt-2 bg-zinc-300/80 transform rotate-45 flex-shrink-0"></div>
                <p className="text-xl sm:text-2xl text-zinc-800 flex-1 font-light leading-relaxed">{point}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default EssenceSection;