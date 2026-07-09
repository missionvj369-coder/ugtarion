import React from 'react';
import type { Pillar } from '../types';
import { AccordionIcon } from './icons';

interface PillarItemProps {
  index: number;
  pillar: Pillar;
  isOpen: boolean;
  onClick: () => void;
}

const PillarItem: React.FC<PillarItemProps> = ({ index, pillar, isOpen, onClick }) => {
  const pillarId = `pillar-description-${index}`;
  return (
    <div className="relative group bg-white/90">
       <div className="absolute -inset-px bg-gradient-to-r from-blue-100 to-purple-100 rounded-sm opacity-0 group-hover:opacity-60 transition-opacity duration-300 blur-md"></div>
       <div className="relative">
        <button 
          onClick={onClick} 
          className="w-full text-left p-6 sm:p-8 transition-colors duration-300 focus:outline-none focus:bg-zinc-50/70"
          aria-expanded={isOpen}
          aria-controls={pillarId}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <pillar.icon className="w-7 h-7 text-zinc-500 group-hover:text-zinc-600 transition-colors" />
                <p className="text-zinc-600 text-sm font-mono">{String(index + 1).padStart(2, '0')}</p>
              </div>
              <h4 className="font-medium mt-4 text-lg text-zinc-900">{pillar.title}</h4>
            </div>
            <div className="flex-shrink-0 pt-1 text-zinc-500">
              <AccordionIcon isOpen={isOpen} />
            </div>
          </div>
        </button>
        <div
          id={pillarId}
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
        >
          <p className="text-zinc-800 leading-relaxed px-6 sm:px-8 pb-6 sm:pb-8 font-light pt-2">{pillar.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PillarItem;