import React, { useState } from 'react';
import { PILLARS_DATA } from '../constants';
import PillarItem from './PillarItem';

const PillarsGrid: React.FC = () => {
  const [openPillar, setOpenPillar] = useState<number | null>(null);

  const handlePillarClick = (index: number) => {
    setOpenPillar(openPillar === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-zinc-200/80 gap-px">
      {PILLARS_DATA.map((pillar, index) => (
        <PillarItem
          key={index}
          index={index}
          pillar={pillar}
          isOpen={openPillar === index}
          onClick={() => handlePillarClick(index)}
        />
      ))}
    </div>
  );
};

export default PillarsGrid;