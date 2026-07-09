import React from 'react';
import { GLOBAL_MISSION } from '../constants';
import SectionWrapper from './SectionWrapper';
import FadeIn from './FadeIn';

const missionItems = [
  GLOBAL_MISSION.challenge,
  GLOBAL_MISSION.opportunity,
  GLOBAL_MISSION.role,
  GLOBAL_MISSION.whyNow,
];

const MissionSection: React.FC = () => {
  return (
    <SectionWrapper>
      <FadeIn>
        <div className="text-left mb-20">
          <p className="text-sm font-semibold text-zinc-600 tracking-widest uppercase">Global Mission</p>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">{GLOBAL_MISSION.title}</h2>
        </div>
      </FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {missionItems.map((item, index) => (
          <FadeIn key={index} delay={index * 100}>
            <div className={`p-10 border-zinc-200/80 ${index === 0 ? 'border-t' : ''} ${index < 2 ? 'md:border-t' : ''} ${index % 2 === 0 ? 'md:border-r' : ''} ${index > 1 ? 'border-t' : ''}`}>
              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight">{item.title}</h3>
              <p className="mt-6 text-lg sm:text-xl text-zinc-800 leading-relaxed font-light">{item.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default MissionSection;