import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Key, Settings, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  openKeyModal?: () => void;
  hasKey?: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ openKeyModal, hasKey, isDarkMode, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getLinkStyle = (path: string, isMobile: boolean = false) => {
    const isActive = location.pathname === path;
    
    if (isMobile) {
        return `block px-6 py-4 rounded-xl text-lg font-bold mb-4 transition-all duration-300 ${
            isActive 
            ? 'bg-[var(--bg)] text-red-600 shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)]' 
            : 'bg-[var(--bg)] text-[var(--text-muted)] shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] hover:text-red-500'
        }`;
    }

    return `px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
        isActive
        ? 'text-red-600 shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)]'
        : 'text-[var(--text-muted)] hover:text-red-500 hover:shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] active:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)]'
    }`;
  };

  return (
    <header className="bg-[var(--bg)] py-4 md:py-6 sticky top-0 z-50 transition-colors duration-300 select-none">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative p-2 md:p-3 rounded-2xl bg-[var(--bg)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] group-hover:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all duration-300">
            {/* Custom ThumbGrabber SVG Icon */}
            <svg 
              viewBox="0 0 48 48" 
              className="w-8 h-8 md:w-10 md:h-10 text-red-600 fill-current drop-shadow-sm" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* YouTube-like Red Container */}
              <rect x="2" y="8" width="44" height="32" rx="9" />
              
              {/* Play Button Triangle */}
              <path d="M18 18L32 24L18 30V18Z" fill="white" />
              
              {/* Grabbing Hand Overlay */}
              <path 
                d="M34 34L42 42" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              />
              <path 
                d="M32 30C32 30 36 28 40 32C44 36 42 40 42 40" 
                stroke="white" 
                strokeWidth="3" 
                strokeLinecap="round" 
                fill="none" 
              />
              <circle cx="39" cy="35" r="2" fill="white" />
            </svg>
          </div>
          <h1 className="text-lg md:text-xl font-black tracking-tight text-[var(--text)]">
            Thumb<span className="text-red-600">Grabber</span>
          </h1>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/" className={getLinkStyle('/')}>Home</Link>
          <Link to="/privacy" className={getLinkStyle('/privacy')}>Privacy</Link>
          <Link to="/terms" className={getLinkStyle('/terms')}>Terms</Link>
          <Link to="/contact" className={getLinkStyle('/contact')}>Contact</Link>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="ml-2 p-3 rounded-xl text-[var(--text-muted)] bg-[var(--bg)] shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] hover:text-blue-500 active:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* API Key Settings Button */}
          {openKeyModal && (
              <button 
                onClick={openKeyModal}
                className={`p-3 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${hasKey 
                    ? 'text-green-600 bg-[var(--bg)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)]' 
                    : 'text-[var(--text-muted)] bg-[var(--bg)] shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] hover:text-blue-500 active:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)]'
                }`}
                title="API Key Settings"
              >
                  {hasKey ? <Key className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
              </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-xl text-[var(--text-muted)] bg-[var(--bg)] shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] active:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
            
            {openKeyModal && (
                <button 
                    onClick={openKeyModal}
                    className={`p-3 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${hasKey 
                        ? 'text-green-600 bg-[var(--bg)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)]' 
                        : 'text-[var(--text-muted)] bg-[var(--bg)] shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] active:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)]'
                    }`}
                >
                    <Key className="w-5 h-5" />
                </button>
            )}
            <button 
                className="p-3 rounded-xl bg-[var(--bg)] text-[var(--text-muted)] shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] active:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)] transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
            >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[var(--bg)] border-t border-[var(--text-muted)]/10 shadow-xl p-6 animate-fade-in z-40">
          <nav className="flex flex-col">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={getLinkStyle('/', true)}>Home</Link>
            <Link to="/privacy" onClick={() => setMobileMenuOpen(false)} className={getLinkStyle('/privacy', true)}>Privacy</Link>
            <Link to="/terms" onClick={() => setMobileMenuOpen(false)} className={getLinkStyle('/terms', true)}>Terms</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={getLinkStyle('/contact', true)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;