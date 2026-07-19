
import React from 'react';
import { FOUNDER_DATA, FOUNDER_SECTION_TITLE } from '../constants';
import SectionWrapper from './SectionWrapper';
import architectProfile from '@/src/assets/images/architect_profile_1783579787768.jpg';

const FounderSection: React.FC = () => {
  return (
    <SectionWrapper>
       <div className="text-left mb-20 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-medium">{FOUNDER_SECTION_TITLE}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
        <div className="md:col-span-5 flex justify-center">
          <div className="w-64 h-64 sm:w-80 sm:h-80 bg-zinc-100 border border-zinc-200/80 rounded-full overflow-hidden shadow-xl shadow-indigo-900/5">
            <img 
              src={architectProfile} 
              alt="Founder & Cosmic Architect of Universal Guard Trust" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="md:col-span-7 space-y-12">
          {Object.values(FOUNDER_DATA).map((item, index) => (
            <div key={index}>
              <h3 className="font-semibold text-zinc-600 tracking-wider uppercase text-sm">{item.title}</h3>
              <p className="mt-3 text-xl sm:text-2xl text-zinc-800 font-light">"{item.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default FounderSection;
