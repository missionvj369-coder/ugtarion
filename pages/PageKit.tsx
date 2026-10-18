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
  <section className="hero-grain relative min-h-[80vh] flex items-center justify-center text-center py-32 px-6 sm:px-8 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAF9FA] to-[#FCFCFC]">
    <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-100/40 to-amber-100/40 blur-3xl opacity-70 animate-float-slow pointer-events-none" />
    <div className="absolute bottom-20 right-1/4 w-[30rem] h-[30rem] rounded-full bg-gradient-to-bl from-amber-50/30 via-indigo-50/30 to-transparent blur-3xl opacity-60 animate-float-slow pointer-events-none" style={{ animationDelay: '3s' }} />
    <div className="relative z-10 max-w-5xl">
      <p className="text-xs sm:text-sm font-semibold text-zinc-900 tracking-[0.2em] uppercase mb-5">{eyebrow}</p>
      <span aria-hidden className="mx-auto mb-7 block h-px w-16 bg-gradient-to-r from-transparent via-amber-500/90 to-transparent" />
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight leading-[1.08] sm:leading-[1.06] text-zinc-900 text-balance">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-8 text-lg sm:text-xl text-zinc-600 max-w-3xl mx-auto font-light leading-relaxed text-pretty">
          {subtitle}
        </p>
      )}
      {children}
    </div>
    <div aria-hidden className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span className="h-10 w-px bg-gradient-to-b from-transparent via-amber-500/80 to-amber-400/40 animate-bounce-slow" />
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
              <div className="mb-5">
                <p className="text-xs sm:text-sm font-semibold text-zinc-900 tracking-[0.2em] uppercase mb-3">{eyebrow}</p>
                <span
                  aria-hidden
                  className={`block h-px w-16 ${
                    center
                      ? 'mx-auto bg-gradient-to-r from-transparent via-amber-500/90 to-transparent'
                      : 'bg-gradient-to-r from-amber-500/90 to-transparent'
                  }`}
                />
              </div>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight text-zinc-900 leading-tight text-balance">{title}</h2>
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
    {title && <h3 className="text-xl sm:text-2xl font-serif font-normal text-zinc-900 mb-4">{title}</h3>}
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
        <div className="group h-full rounded-2xl border border-zinc-200/70 bg-white/60 backdrop-blur-sm p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:bg-white/90 hover:shadow-xl hover:shadow-amber-900/10">
          <p className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-900 uppercase tracking-widest mb-3 tabular-nums transition-colors duration-300">
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
  variant?: 'primary' | 'outline' | 'light' | 'outlineLight';
  className?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({ label, to, onClick, variant = 'primary', className = '' }) => {
  const classes =
    variant === 'primary'
      ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10 hover:shadow-xl hover:shadow-amber-900/20 hover:ring-2 hover:ring-amber-400/50'
      : variant === 'light'
      ? 'bg-white text-zinc-900 hover:bg-amber-50 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-amber-500/25 hover:ring-2 hover:ring-amber-400/60'
      : variant === 'outlineLight'
      ? 'border border-white/40 text-white hover:border-amber-400/70 hover:bg-white/10'
      : 'border border-zinc-300 text-zinc-800 hover:border-zinc-900 hover:bg-zinc-50 hover:shadow-md hover:shadow-zinc-900/5';

  const finalClasses = `inline-flex items-center justify-center font-medium px-8 py-3.5 text-sm tracking-wider uppercase rounded-full transition-all duration-300 active:scale-95 hover:-translate-y-0.5 ${classes} ${className}`;

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
  <section className="relative overflow-hidden py-24 sm:py-32 bg-zinc-950 text-white">
    <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
    <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-20 w-[30rem] h-[30rem] rounded-full bg-amber-500/10 blur-3xl" />
    <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
    <div className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center">
      <FadeIn>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight leading-tight">{title}</h2>
        {subtitle && <p className="mt-6 text-lg text-zinc-400 font-light">{subtitle}</p>}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryLabel && (primaryTo || onOpenIdModal) && (
            <CTAButton label={primaryLabel} to={primaryTo} onClick={onOpenIdModal} variant="light" />
          )}
          {secondaryLabel && secondaryTo && <CTAButton label={secondaryLabel} to={secondaryTo} variant="outlineLight" />}
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
        {i < steps.length - 1 && <span className="text-zinc-400 text-sm font-light" aria-hidden>→</span>}
      </React.Fragment>
    ))}
  </div>
);