import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const Header = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white">
              <span className="text-blue-400">My</span>LeakWatch
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Passwords
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Notify Me
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </a>
            <div className="relative">
              <button
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                About
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isAboutOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg py-1 z-10">
                  <a href="#about" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-600 hover:text-white">
                    About Us
                  </a>
                  <a href="#contact" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-600 hover:text-white">
                    Contact Us
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Dashboard Button */}
          <div className="hidden md:flex items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
              Chat With AI
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-700/90 rounded-md mt-2">
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base">
                Home
              </a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base">
                Passwords
              </a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base">
                Notify Me
              </a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base">
                Docs
              </a>
              <a href="#about" className="text-gray-300 hover:text-white block px-3 py-2 text-base">
                About
              </a>
              <button className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors mt-2">
                Chat With AI
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;