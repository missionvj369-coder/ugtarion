import React, { useState, useEffect } from 'react';
import { HERO_DATA } from '../constants';
import { UgtLogoIcon } from './icons';

interface HeaderProps {
  onOpenIdModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenIdModal }) => {
  const [scrolled, setScrolled] = useState(false);

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
          <a href="#" aria-label="Home" className="flex items-center gap-2.5 text-zinc-900 select-none">
            <UgtLogoIcon className="h-6 w-6 text-zinc-900 shrink-0" />
            <span className="font-semibold tracking-wider text-xs sm:text-base uppercase whitespace-nowrap block sm:hidden">
              UGT
            </span>
            <span className="font-semibold tracking-wider text-base uppercase whitespace-nowrap hidden sm:block">
              Universal Guard Trust
            </span>
          </a>
          <button
            onClick={onOpenIdModal}
            className="bg-zinc-900 text-white hover:bg-zinc-800 font-medium px-3.5 sm:px-5 py-2 text-[11px] sm:text-xs md:text-sm tracking-wider uppercase rounded-full transition-all duration-300 shrink-0 shadow-sm active:scale-95"
          >
            Universal ID
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;