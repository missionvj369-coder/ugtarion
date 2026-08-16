import React from 'react';
import SectionWrapper from './SectionWrapper';

interface VisionSectionProps {
  className?: string;
}

const VISION_CONTENT = `THE QUESTION
Humanity has spent thousands of years asking the deepest questions.

THE WORK OF CONNECTION
The world's knowledge is enormous. Its fragments are everywhere.

THE SEARCH FOR TRUTH
Truth before belief. Evidence before certainty.

HUMANITY AS A LIVING SYSTEM
A human being does not live inside one system.

FROM UNDERSTANDING TO CREATION
Knowledge alone does not transform reality.

THE POSSIBILITY
A system capable of bringing many forms of intelligence together.

THE INVITATION
What could we build if we decided that human flourishing was a shared responsibility?

THE FUTURE IS NOT A PLACE WE ARRIVE.
IT IS A CIVILIZATION WE CONTINUOUSLY CREATE.`;

const VisionSection: React.FC<VisionSectionProps> = ({ className }) => {
  const contentLines = VISION_CONTENT.split('\n');

  return (
    <SectionWrapper>
      <div className={`max-w-4xl mx-auto text-center ${className || ''}`}>
        <div className="text-3xl sm:text-4xl md:text-5xl text-zinc-600/80 font-medium leading-relaxed mb-12">
          {contentLines
            .filter((line) => line.trim() && !line.startsWith('THE ') && !line.startsWith('HUMANITY') && !line.startsWith('IT IS') && !line.startsWith('FROM') && line.trim().length > 0)
            .map((line, index) => (
              <p key={index} className="text-zinc-700/90 text-lg sm:text-base leading-relaxed">
                {line}
              </p>
            ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default VisionSection;
