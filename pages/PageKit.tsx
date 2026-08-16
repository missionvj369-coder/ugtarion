import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({ eyebrow = 'Universal Guard Trust', title, subtitle, children }) => (
  <section className="relative min-h-[70vh] flex items-center justify-center text-center py-32 px-6 sm:px-8 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAF9FA] to-[#FCFCFC]">
    <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-100/30 to-amber-100/30 blur-3xl opacity-60 pointer-events-none" />
    <div className="absolute bottom-20 right-1/4 w-[30rem] h-[30rem] rounded-full bg-gradient-to-bl from-amber-50/20 via-indigo-50/20 to-transparent blur-3xl opacity-50 pointer-events-none" />
    <div className="relative z-10 max-w-5xl">
      <p className="text-xs sm:text-sm font-semibold text-zinc-500 tracking-[0.2em] uppercase mb-6">{eyebrow}</p>
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tighter leading-tight sm:leading-tight text-zinc-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-8 text-lg sm:text-xl text-zinc-600 max-w-3xl mx-auto font-light leading-relaxed">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  </section>
);

interface ContentSectionProps {
  eyebrow?: string;
  title?: string;
  lead?: string;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  center?: boolean;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ eyebrow, title, lead, children, className = '', id, center = false }) => (
  <section id={id} className={`py-20 sm:py-28 ${className}`}>
    <div className="max-w-7xl mx-auto px-6 sm:px-8">
      <FadeIn>
        {(eyebrow || title) && (
          <div className={`${center ? 'text-center' : 'text-left'} mb-12 sm:mb-16 max-w-3xl`}>
            {eyebrow && (
              <p className="text-xs sm:text-sm font-semibold text-zinc-500 tracking-[0.2em] uppercase mb-4">{eyebrow}</p>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-zinc-900 leading-tight">{title}</h2>
            )}
            {lead && (
              <p className={`mt-6 text-lg text-zinc-600 font-light leading-relaxed ${center ? 'mx-auto' : ''}`}>{lead}</p>
            )}
          </div>
        )}
      </FadeIn>
      <FadeIn delay={100}>{children}</FadeIn>
    </div>
  </section>
);

interface BlockProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Block: React.FC<BlockProps> = ({ title, children, className = '' }) => (
  <div className={className}>
    {title && <h3 className="text-xl sm:text-2xl font-light text-zinc-900 mb-4">{title}</h3>}
    <div className="space-y-4 text-zinc-700 leading-relaxed font-light text-base sm:text-lg">{children}</div>
  </div>
);

export const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-zinc-700/90 text-base sm:text-lg leading-relaxed ${className}`}>{children}</p>
);

interface PillarGridProps {
  items: { title: string; description: string }[];
  accent?: boolean;
}

export const PillarGrid: React.FC<PillarGridProps> = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {items.map((item, i) => (
      <FadeIn key={item.title} delay={i * 40}>
        <div className="h-full rounded-2xl border border-zinc-200/70 bg-white/60 backdrop-blur-sm p-6 sm:p-8 hover:border-zinc-300 transition-colors">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            {String(i + 1).padStart(2, '0')}
          </p>
          <h4 className="text-base sm:text-lg font-medium text-zinc-900 mb-2">{item.title}</h4>
          <p className="text-sm text-zinc-600 font-light leading-relaxed">{item.description}</p>
        </div>
      </FadeIn>
    ))}
  </div>
);

interface CTAButtonProps {
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

export const CTAButton: React.FC<CTAButtonProps> = ({ label, to, onClick, variant = 'primary' }) => {
  const classes =
    variant === 'primary'
      ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10'
      : 'border border-zinc-300 text-zinc-800 hover:border-zinc-900 hover:bg-zinc-50';

  const finalClasses = `inline-flex items-center justify-center font-medium px-8 py-3.5 text-sm tracking-wider uppercase rounded-full transition-all duration-300 active:scale-95 ${classes}`;

  if (to) {
    // External links
    if (to.startsWith('http://') || to.startsWith('https://')) {
      return (
        <a href={to} target="_blank" rel="noopener noreferrer" className={finalClasses}>
          {label}
        </a>
      );
    }
    return (
      <Link to={to} className={finalClasses}>
        {label}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button onClick={onClick} className={finalClasses}>
        {label}
      </button>
    );
  }
  return <span className={finalClasses}>{label}</span>;
};

interface CTASectionProps {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  onOpenIdModal?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  onOpenIdModal,
}) => (
  <section className="py-24 sm:py-32 bg-zinc-900 text-white">
    <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
      <FadeIn>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight">{title}</h2>
        {subtitle && <p className="mt-6 text-lg text-zinc-400 font-light">{subtitle}</p>}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryLabel && (primaryTo || onOpenIdModal) && (
            <CTAButton label={primaryLabel} to={primaryTo} onClick={onOpenIdModal} />
          )}
          {secondaryLabel && secondaryTo && <CTAButton label={secondaryLabel} to={secondaryTo} variant="outline" />}
        </div>
      </FadeIn>
    </div>
  </section>
);

interface FlowDisplayProps {
  steps: string[];
  label?: string;
}

export const FlowDisplay: React.FC<FlowDisplayProps> = ({ steps, label = 'The Loop' }) => (
  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
    {steps.map((step, i) => (
      <React.Fragment key={step}>
        <span className="px-4 py-2 text-xs sm:text-sm font-medium text-zinc-800 uppercase tracking-wider bg-white border border-zinc-200 rounded-full">
          {step}
        </span>
        {i < steps.length - 1 && <span className="text-zinc-400 text-sm font-light">→</span>}
      </React.Fragment>
    ))}
  </div>
);