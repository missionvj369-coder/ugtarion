import React, { useState, useEffect } from 'react';
import { UgtLogoIcon } from './icons';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onOpenIdModal: () => void;
}

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'About UGT', to: '/about-universal-guard-trust' },
  { label: 'Vision', to: '/vision' },
  { label: 'Blueprint', to: '/blueprint' },
  { label: 'Human Evolution', to: '/human-evolution' },
  { label: 'Integrated Intelligence', to: '/integrated-intelligence' },
  { label: 'Civilization', to: '/civilization-transformation' },
  { label: 'Heaven on Earth', to: '/heaven-on-earth' },
  { label: 'Universal ID', to: '/universal-id' },
  { label: 'Projects', to: '/projects' },
  { label: 'Join', to: '/join' },
];

const Header: React.FC<HeaderProps> = ({ onOpenIdModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || mobileMenuOpen
        ? 'bg-white/95 backdrop-blur-sm border-b border-zinc-200/60 shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <a href="/" aria-label="Home" className="flex items-center gap-2 text-zinc-900 select-none shrink-0">
            <UgtLogoIcon className="h-6 w-6 text-zinc-900 shrink-0" />
            <span className="flex flex-col leading-tight">
              <span className="font-semibold tracking-wider text-sm sm:text-base uppercase whitespace-nowrap">
                UGT
              </span>
              <span className="text-[8px] sm:text-[9px] text-zinc-500 tracking-wide uppercase whitespace-nowrap hidden md:block">
                Transforming Lives · Shaping Future
              </span>
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-4 ml-4 xl:ml-6" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-[10px] xl:text-[11px] font-medium tracking-wider uppercase transition-colors whitespace-nowrap ${
                    isActive ? 'text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenIdModal}
              className="hidden md:inline-block bg-zinc-900 text-white hover:bg-zinc-800 font-medium px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] tracking-wider uppercase rounded-full transition-all duration-300 shrink-0 shadow-sm active:scale-95"
            >
              Universal ID
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-zinc-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-2.5 text-sm tracking-wide uppercase transition-colors rounded-lg ${
                      isActive ? 'text-zinc-900 bg-zinc-100' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenIdModal();
                }}
                className="mt-3 bg-zinc-900 text-white hover:bg-zinc-800 font-medium px-5 py-2.5 text-sm tracking-wider uppercase rounded-full transition-all duration-300 active:scale-95"
              >
                Universal ID
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;