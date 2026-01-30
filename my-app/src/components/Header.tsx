import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatDrawer from './ChatDrawer';

type Page = 'home' | 'docs' | 'stats';

const Header = ({ onNavigate, currentPage }: { onNavigate?: (p: Page) => void; currentPage?: Page }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  // Smooth scroll helper that also navigates to Home first if needed
  const scrollToId = (id: string) => {
    // Navigate to home view if not already there
    if (currentPage !== 'home') onNavigate?.('home');

    // Wait for home DOM to mount (next tick), then scroll
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const goBreachMonitor = () => {
    if (location.pathname !== '/breach-monitor') navigate('/breach-monitor');
  };

  const goStats = () => {
    if (location.pathname !== '/stats') navigate('/stats');
  };

  const navLink = (label: string, page: Page) => (
    <button
      onClick={() => onNavigate?.(page)}
      className={`transition-colors ${currentPage === page ? 'text-white' : 'text-gray-300 hover:text-white'}`}
    >
      {label}
    </button>
  );

  const breachMonitorClasses =
    location.pathname === '/breach-monitor'
      ? 'text-white'
      : 'text-gray-300 hover:text-white';

  const statsClasses =
    location.pathname === '/stats'
      ? 'text-white'
      : 'text-gray-300 hover:text-white';

  return (
    <>
      <header className="bg-slate-900 backdrop-blur-sm border-b border-slate-700/50 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div
                className="text-2xl font-bold text-white cursor-pointer"
                onClick={() => onNavigate?.('home')}
                aria-label="MyLeakWatch Home"
              >
                <span className="text-blue-400">My</span>LeakWatch
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLink('Home', 'home')}

              {/* Breach Monitor → /breach-monitor */}
              <button
                onClick={goBreachMonitor}
                className={`transition-colors ${breachMonitorClasses}`}
                aria-current={location.pathname === '/breach-monitor' ? 'page' : undefined}
              >
                Breach Monitor
              </button>

              {/* Smooth scroll to sections on Home */}
              <button
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => scrollToId('imageSearch')}
              >
                Image Search
              </button>

              {/* Stats */}
              <button
                onClick={goStats}
                className={`transition-colors ${statsClasses}`}
                aria-current={location.pathname === '/stats' ? 'page' : undefined}
              >
                Visual Map
              </button>

              {navLink('Docs', 'docs')}

              <div className="relative">
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={isAboutOpen}
                >
                  About
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isAboutOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg py-1 z-40">
                    <button
                      onClick={() => { scrollToId('about'); setIsAboutOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-600 hover:text-white"
                    >
                      About Us
                    </button>
                    <button
                      onClick={() => { scrollToId('contact'); setIsAboutOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-600 hover:text-white"
                    >
                      Contact Us
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Chat button (desktop) */}
            <div className="hidden md:flex items-center">
              <button
                onClick={openChat}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Chat With AI
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-700/90 rounded-md mt-2">
                <button
                  onClick={() => { onNavigate?.('home'); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-base rounded ${currentPage==='home'?'text-white':'text-gray-300 hover:text-white'}`}
                >
                  Home
                </button>

                {/* Breach Monitor → /breach-monitor */}
                <button
                  onClick={() => { goBreachMonitor(); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-base ${breachMonitorClasses}`}
                  aria-current={location.pathname === '/breach-monitor' ? 'page' : undefined}
                >
                  Breach Monitor
                </button>

                {/* Smooth scroll buttons */}
                <button
                  onClick={() => { setIsMobileMenuOpen(false); scrollToId('imageSearch'); }}
                  className="block w-full text-left px-3 py-2 text-base text-gray-300 hover:text-white"
                >
                  Image Search
                </button>

                {/* Stats */}
                <button
                  onClick={() => { goStats(); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-base ${statsClasses}`}
                  aria-current={location.pathname === '/stats' ? 'page' : undefined}
                >
                  Visual Map
                </button>

                <button
                  onClick={() => { setIsMobileMenuOpen(false); scrollToId('about'); }}
                  className="block w-full text-left px-3 py-2 text-base text-gray-300 hover:text-white"
                >
                  About Us
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); scrollToId('contact'); }}
                  className="block w-full text-left px-3 py-2 text-base text-gray-300 hover:text-white"
                >
                  Contact Us
                </button>

                <button
                  onClick={() => { onNavigate?.('docs'); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-base rounded ${currentPage==='docs'?'text-white':'text-gray-300 hover:text-white'}`}
                >
                  Docs
                </button>

                <button
                  onClick={() => { openChat(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors mt-2"
                >
                  Chat With AI
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Drawer mounted outside header so it isn't clipped */}
      <ChatDrawer isOpen={isChatOpen} onClose={closeChat} />
    </>
  );
};

export default Header;
