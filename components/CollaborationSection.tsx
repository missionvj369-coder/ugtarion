import React from 'react';
import { COLLABORATION_DATA } from '../constants';
import SectionWrapper from './SectionWrapper';
import FadeIn from './FadeIn';

const CollaborationSection: React.FC = () => {
  return (
    <SectionWrapper>
      <FadeIn>
        <div className="text-left mb-20 max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-medium">{COLLABORATION_DATA.title}</h2>
        </div>
      </FadeIn>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
        {COLLABORATION_DATA.items.map((item, index) => (
          <FadeIn key={index} delay={index * 100}>
            <div>
              <h3 className="text-xl font-medium">{item.title}</h3>
              <div className="w-16 h-px bg-zinc-300 my-4"></div>
              <p className="text-lg text-zinc-800 font-light">{item.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default CollaborationSection;
