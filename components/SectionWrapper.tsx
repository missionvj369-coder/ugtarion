import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className = '' }) => {
  return (
    <section className={`py-28 sm:py-40 md:py-48 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;