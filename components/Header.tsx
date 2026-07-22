import React, { useState, useEffect } from 'react';
import { HERO_DATA } from '../constants';
import { UgtLogoIcon } from './icons';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenIdModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenIdModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-sm border-b border-zinc-200/60 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          <a href="/" aria-label="Home" className="flex items-center gap-2.5 text-zinc-900 select-none">
            <UgtLogoIcon className="h-6 w-6 text-zinc-900 shrink-0" />
            <span className="font-semibold tracking-wider text-xs sm:text-base uppercase whitespace-nowrap block sm:hidden">
              UGT
            </span>
            <span className="font-semibold tracking-wider text-base uppercase whitespace-nowrap hidden sm:block">
              Universal Guard Trust
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/faq" className="text-xs sm:text-sm text-zinc-600 hover:text-zinc-900 tracking-wide uppercase transition-colors">
              FAQ
            </Link>
            <Link to="/privacy" className="text-xs sm:text-sm text-zinc-600 hover:text-zinc-900 tracking-wide uppercase transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs sm:text-sm text-zinc-600 hover:text-zinc-900 tracking-wide uppercase transition-colors">
              Terms
            </Link>
          </nav>
          
          <button
            onClick={onOpenIdModal}
            className="bg-zinc-900 text-white hover:bg-zinc-800 font-medium px-3.5 sm:px-5 py-2 text-[11px] sm:text-xs md:text-sm tracking-wider uppercase rounded-full transition-all duration-300 shrink-0 shadow-sm active:scale-95"
          >
            Universal ID
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
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
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-zinc-200">
            <div className="flex flex-col gap-4">
              <Link 
                to="/faq" 
                className="text-sm text-zinc-600 hover:text-zinc-900 tracking-wide uppercase transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                to="/privacy" 
                className="text-sm text-zinc-600 hover:text-zinc-900 tracking-wide uppercase transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-zinc-600 hover:text-zinc-900 tracking-wide uppercase transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Terms of Service
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
