
import React, { useState, useRef, useEffect } from 'react';
import { MailIcon, WhatsappIcon, FooterUgtLogo, LinkedInIcon, XIcon, InstagramIcon, FacebookIcon, ClipboardIcon, CheckIcon } from './icons';
import { CONTACT_SECTION_DATA } from '../constants';

const Footer: React.FC = () => {
  const [isLogoVisible, setLogoVisible] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null); // State to track which email was copied
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const emailButtonRef = useRef<HTMLAnchorElement>(null);
  const emailOptionsRef = useRef<HTMLDivElement>(null);
  const tagline = "The Future YOU Imagined Lives ON in US";

  const socialTooltips = {
    linkedin: "Connect with the minds shaping our future.",
    x: "Join the real-time conversation on conscious evolution.",
    instagram: "Discover our journey and connect with our community.",
    facebook: "Follow our updates and engage with our mission.",
  };

  const highlightWords = new Set(["YOU", "ON", "US"]);
  let charCounter = 0;
  const baseRevealDelay = 1700;
  const perCharDelay = 30;
  const charAnimationDuration = 600;
  const totalRevealTime = baseRevealDelay + (tagline.length * perCharDelay) + charAnimationDuration;

  const highlightAnimationDelays: { [key: string]: string } = {
    'YOU': `${totalRevealTime}ms`,
    'ON': `${totalRevealTime + 500}ms`,
    'US': `${totalRevealTime + 1000}ms`
  };

  const renderedTagline = tagline.split(' ').map((word, wordIndex, wordsArray) => {
    const isHighlight = highlightWords.has(word);
    const wordChars = word.split('').map((char, charInWordIndex) => {
        const delay = `${charCounter * perCharDelay + baseRevealDelay}ms`;
        charCounter++;
        return (
            <span key={`${wordIndex}-${charInWordIndex}`} className="tagline-char" style={{ transitionDelay: delay }} aria-hidden="true">
                {char}
            </span>
        );
    });

    const spaceDelay = `${charCounter * perCharDelay + baseRevealDelay}ms`;
    if (wordIndex < wordsArray.length - 1) {
        charCounter++;
    }

    return (
        <React.Fragment key={wordIndex}>
            <span
                className={isHighlight ? 'highlight-word' : ''}
                style={isHighlight ? { animationDelay: highlightAnimationDelays[word] } : {}}
            >
                {wordChars}
            </span>
            {wordIndex < wordsArray.length - 1 && (
                <span className="tagline-char" style={{ transitionDelay: spaceDelay }} aria-hidden="true">
                    {'\u00A0'}
                </span>
            )}
        </React.Fragment>
    );
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLogoVisible(true);
          if (logoContainerRef.current) {
            observer.unobserve(logoContainerRef.current);
          }
        }
      },
      // Trigger when 20% of the footer is visible to ensure animation is seen
      { threshold: 0.2 }
    );

    const currentRef = logoContainerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emailOptionsRef.current &&
        !emailOptionsRef.current.contains(event.target as Node) &&
        emailButtonRef.current &&
        !emailButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmailOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEmailOptions(!showEmailOptions);
  };

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000); // Reset copied state after 2 seconds
    }).catch(err => {
      console.error("Failed to copy email: ", err);
      // Optionally, show an error message to the user
    });
  };

  return (
    <footer id="contact" className="py-24 sm:py-32 bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">{CONTACT_SECTION_DATA.title}</h2>
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto font-light">
          {CONTACT_SECTION_DATA.subtitle}
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 relative">
          <a 
            href="#"
            onClick={handleEmailClick}
            ref={emailButtonRef}
            className="inline-flex items-center justify-center gap-3 bg-white text-zinc-900 font-medium px-8 py-3 text-base tracking-wide rounded-full transition-transform hover:scale-105 relative z-10"
            aria-expanded={showEmailOptions}
            aria-haspopup="true"
          >
            <MailIcon className="w-5 h-5" />
            <span>Email</span>
          </a>
          {showEmailOptions && (
            <div 
              ref={emailOptionsRef}
              className="absolute top-full mt-2 w-72 sm:w-80 md:w-96 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-zinc-200 p-4 animate-fade-in-scale-up z-20"
              role="menu"
              aria-orientation="vertical"
            >
              <p className="text-sm text-zinc-600 mb-3 text-left font-medium">Choose your connection:</p>
              <div className="relative group/email">
                <a
                  href="mailto:oneness@ugtglobal.space"
                  className="block w-full text-left px-4 py-3 text-zinc-800 hover:bg-zinc-100 rounded-md transition-colors text-base font-light pr-12"
                  role="menuitem"
                  onClick={() => setShowEmailOptions(false)}
                >
                  <span className="font-medium text-zinc-900">For Dreamers & Learners:</span><br/> 
                  <span className="text-zinc-600 text-sm"><span className="font-semibold">oneness@ugtglobal.space</span></span>
                </a>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard('oneness@ugtglobal.space'); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Copy oneness@ugtglobal.space"
                >
                  {copiedEmail === 'oneness@ugtglobal.space' ? (
                    <CheckIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <ClipboardIcon className="w-5 h-5" />
                  )}
                </button>
                {copiedEmail === 'oneness@ugtglobal.space' && (
                  <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-md opacity-0 animate-fade-in-scale-up pointer-events-none">Copied!</span>
                )}
              </div>
              <div className="relative group/email mt-2">
                <a
                  href="mailto:soulconnect@ugtglobal.space"
                  className="block w-full text-left px-4 py-3 text-zinc-800 hover:bg-zinc-100 rounded-md transition-colors text-base font-light pr-12"
                  role="menuitem"
                  onClick={() => setShowEmailOptions(false)}
                >
                  <span className="font-medium text-zinc-900">For Organizations:</span><br/>
                  <span className="text-zinc-600 text-sm"><span className="font-semibold">soulconnect@ugtglobal.space</span></span>
                </a>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard('soulconnect@ugtglobal.space'); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Copy soulconnect@ugtglobal.space"
                >
                  {copiedEmail === 'soulconnect@ugtglobal.space' ? (
                    <CheckIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <ClipboardIcon className="w-5 h-5" />
                  )}
                </button>
                {copiedEmail === 'soulconnect@ugtglobal.space' && (
                  <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-md opacity-0 animate-fade-in-scale-up pointer-events-none">Copied!</span>
                )}
              </div>
            </div>
          )}
          <a
            href="https://wa.me/919443963973"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-transparent text-white font-medium px-8 py-3 text-base tracking-wide rounded-full transition-transform hover:scale-105 border border-zinc-700 hover:bg-zinc-800"
          >
            <WhatsappIcon className="w-5 h-5" />
            <span>WhatsApp</span>
          </a>
        </div>
        <div className="mt-24 pt-8 border-t border-zinc-700/50" ref={logoContainerRef}>
            <div className="flex flex-col items-center justify-center gap-4">
                <a href="#" aria-label="Home" className="p-2 -m-2">
                    <FooterUgtLogo className={`h-6 w-auto text-zinc-400 hover:text-white transition-colors duration-300 ${isLogoVisible ? 'logo-animate' : ''}`} />
                </a>
                <p 
                    className={`text-zinc-500 text-sm ${isLogoVisible ? 'tagline-animate' : ''}`}
                    aria-label={tagline}
                >
                    {renderedTagline}
                </p>
            </div>
            <div className={`mt-8 flex items-center justify-center gap-6 transition-opacity duration-700 ${isLogoVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${totalRevealTime + 1500}ms`}}>
                <div className="relative">
                    <a 
                        href="https://www.linkedin.com/in/universal-guard-trust-951695351?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="LinkedIn" 
                        className="block p-2 text-zinc-500 hover:text-white transition-colors duration-300 transform hover:scale-110"
                        onMouseEnter={() => setHoveredSocial('linkedin')}
                        onMouseLeave={() => setHoveredSocial(null)}
                    >
                        <LinkedInIcon className="w-6 h-6" />
                    </a>
                    {hoveredSocial === 'linkedin' && <div className="custom-tooltip">{socialTooltips.linkedin}</div>}
                </div>
                <div className="relative">
                    <a 
                        href="https://x.com/ugthumanity?s=21" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="X" 
                        className="block p-2 text-zinc-500 hover:text-white transition-colors duration-300 transform hover:scale-110"
                        onMouseEnter={() => setHoveredSocial('x')}
                        onMouseLeave={() => setHoveredSocial(null)}
                    >
                        <XIcon className="w-6 h-6" />
                    </a>
                    {hoveredSocial === 'x' && <div className="custom-tooltip">{socialTooltips.x}</div>}
                </div>
                <div className="relative">
                    <a 
                        href="https://www.instagram.com/ugt_humanity?igsh=MWl2NDFxemw5Z3F3dQ%3D%3D&utm_source=qr" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Instagram" 
                        className="block p-2 text-zinc-500 hover:text-white transition-colors duration-300 transform hover:scale-110"
                        onMouseEnter={() => setHoveredSocial('instagram')}
                        onMouseLeave={() => setHoveredSocial(null)}
                    >
                        <InstagramIcon className="w-6 h-6" />
                    </a>
                    {hoveredSocial === 'instagram' && <div className="custom-tooltip">{socialTooltips.instagram}</div>}
                </div>
                <div className="relative">
                    <a 
                        href="https://www.facebook.com/profile.php?id=61562748112032&sfnsn=mo" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Facebook" 
                        className="block p-2 text-zinc-500 hover:text-white transition-colors duration-300 transform hover:scale-110"
                        onMouseEnter={() => setHoveredSocial('facebook')}
                        onMouseLeave={() => setHoveredSocial(null)}
                    >
                        <FacebookIcon className="w-6 h-6" />
                    </a>
                    {hoveredSocial === 'facebook' && <div className="custom-tooltip">{socialTooltips.facebook}</div>}
                </div>
            </div>
            <p 
                className={`mt-8 text-zinc-500 text-sm transition-opacity duration-700 ${isLogoVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${totalRevealTime + 1600}ms`}}
            >
                &copy; {new Date().getFullYear()} Universal Guard Trust. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
