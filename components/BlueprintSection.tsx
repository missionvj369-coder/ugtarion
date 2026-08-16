import React from 'react';
import { GLOBAL_MISSION } from '../constants';
import SectionWrapper from './SectionWrapper';
import FadeIn from './FadeIn';

const BlueprintSection: React.FC = () => {
  return (
    <SectionWrapper>
      <FadeIn>
        <div className="text-left mb-20">
          <p className="text-sm font-semibold text-zinc-600 tracking-widest uppercase">Master Blueprint</p>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">{GLOBAL_MISSION.title}</h2>
        </div>
      </FadeIn>
      <div className="prose max-w-2xl mx-auto">
        <p className="text-zinc-800 leading-relaxed">
          {GLOBAL_MISSION.opportunity.text}
        </p>
        <p className="mt-6 text-zinc-700/90 leading-relaxed">
          {GLOBAL_MISSION.role.text}
        </p>
        <p className="mt-6 text-zinc-700/90 leading-relaxed">
          {GLOBAL_MISSION.whyNow.text}
        </p>
      </div>
    </SectionWrapper>
  );
};

export default BlueprintSection;