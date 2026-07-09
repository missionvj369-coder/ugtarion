import React from 'react';

export const UgtLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 280 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* New Symbolic Logomark */}
    <g transform="translate(12, 12)">
      {/* Central Core */}
      <circle cx="0" cy="0" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      {/* Outer Orbits/Arcs */}
      <path d="M 10 0 A 10 10 0 0 1 -5 8.66" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M -10 0 A 10 10 0 0 1 5 -8.66" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </g>
    {/* Wordmark */}
    <text x="36" y="17" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="16" fontWeight="600" fill="currentColor">UNIVERSAL GUARD TRUST</text>
  </svg>
);

export const UgtLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g>
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M 22 12 A 10 10 0 0 1 7 20.66" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M 2 12 A 10 10 0 0 1 17 3.34" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </g>
  </svg>
);

export const AccordionIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-45' : 'rotate-0'}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        {children}
    </svg>
);

export const YouthIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></IconWrapper>
);
export const MentalStrengthIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M5.338 16.338a2.5 2.5 0 013.536 0M18.662 16.338a2.5 2.5 0 00-3.536 0M12 19.5v-3.375" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c4.638 0 8.573 3.06 9.386 7.154M12 4.5c-4.638 0-8.573 3.06-9.386 7.154" /></IconWrapper>
);
export const EducationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" /></IconWrapper>
);
export const SkillsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></IconWrapper>
);
export const WomenPowerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" /></IconWrapper>
);
export const RuralIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></IconWrapper>
);
export const UnityIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></IconWrapper>
);
export const RehabilitationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></IconWrapper>
);
export const AddictionFreeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" /></IconWrapper>
);
export const EconomicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></IconWrapper>
);
export const DigitalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></IconWrapper>
);
export const EnvironmentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.884 5.066A9.013 9.013 0 0012 3c2.396 0 4.61 1.01 6.116 2.066M6.341 18.066A9.013 9.013 0 0012 21c2.396 0 4.61-1.01 6.116-2.066" /></IconWrapper>
);
export const HealthIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></IconWrapper>
);
export const GovernanceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" /></IconWrapper>
);
export const FamilyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></IconWrapper>
);
export const CharacterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></IconWrapper>
);
export const CultureIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></IconWrapper>
);
export const ScienceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></IconWrapper>
);
export const ResilienceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></IconWrapper>
);
export const GlobalLeadershipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 12a2 2 0 100-4 2 2 0 000 4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /></IconWrapper>
);

export const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </IconWrapper>
);

export const WhatsappIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </IconWrapper>
);

export const DocumentViewIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </IconWrapper>
);

export const DocumentDownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </IconWrapper>
);

export const ScrollIndicatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

export const FooterUgtLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 160 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <g transform="translate(12, 12)">
            <circle className="ugt-logo-circle" cx="0" cy="0" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <path className="ugt-logo-path1" d="M 10 0 A 10 10 0 0 1 -5 8.66" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path className="ugt-logo-path2" d="M -10 0 A 10 10 0 0 1 5 -8.66" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </g>
        <text className="ugt-logo-text" x="36" y="17" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="16" fontWeight="600" fill="currentColor">UGTARION</text>
    </svg>
);

export const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.071 1.173.056 1.745.244 2.158.402.433.167.757.37.962.574.205.204.407.527.574.96.158.413.346.985.402 2.158.058 1.265.07 1.645.07 4.849 0 3.204-.012 3.584-.071 4.85-.056 1.173-.244 1.745-.402 2.158-.167.433-.37.757-.574.962-.204.205-.527.407-.96.574-.413.158-.985.346-2.158.402-1.265.058-1.645.07-4.849.07-3.204 0-3.584-.012-4.85-.071-1.173-.056-1.745-.244-2.158-.402-.433-.167-.757-.37-.962-.574-.205-.204-.407-.527-.574-.96-.158-.413-.346-.985-.402-2.158-.058-1.265-.07-1.645-.07-4.849 0-3.204.012-3.584.071-4.85.056-1.173.244-1.745.402-2.158.167-.433.37-.757.574-.962.204-.205.527-.407.96-.574.413-.158.985-.346 2.158-.402 1.265-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.396.067-2.378.297-3.228.631-.838.328-1.494.75-2.121 1.378-.628.627-1.05.783-1.378 2.121-.334.85-.564 1.832-.631 3.228-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.067 1.396.297 2.378.631 3.228.328.838.75 1.494 1.378 2.121.627.628 1.05.783 2.121 1.378.85.334 1.832.564 3.228.631 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.396-.067 2.378-.297 3.228-.631.838-.328 1.494-.75 2.121-1.378.628-.627 1.05-.783 1.378-2.121.334-.85.564-1.832.631-3.228.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.067-1.396-.297-2.378-.631-3.228-.328-.838-.75-1.494-1.378-2.121-.627-.628-1.05-.783-2.121-1.378-.85-.334-1.832-.564-3.228-.631-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.443.647-1.443 1.443s.647 1.443 1.443 1.443c.796 0 1.443-.647 1.443-1.443s-.647-1.443-1.443-1.443z" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.908c0-.817.092-1.092 1.092-1.092h3.908v-3h-4.465c-4.14 0-5.535 3.037-5.535 5.292v2.708z"/>
    </svg>
);

export const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75L10.5 18.75L19.5 5.25" />
    </IconWrapper>
);