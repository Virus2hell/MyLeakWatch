import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

type Page = 'home' | 'docs';

const Footer = ({ onNavigate, currentPage }: { onNavigate?: (p: Page) => void; currentPage?: Page }) => {
  const goDocs = () => onNavigate?.('docs');
  const goImageSearch = () => {
    onNavigate?.('home');
    // wait for home to mount, then scroll
    setTimeout(() => {
      const el = document.getElementById('imageSearch');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const goEmailSearch = () => {
    onNavigate?.('home');
    // wait for home to mount, then scroll
    setTimeout(() => {
      const el = document.getElementById('emailSearch');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="text-2xl font-bold text-white mb-4 cursor-pointer" onClick={() => onNavigate?.('home')}>
              <span className="text-blue-400">My</span>LeakWatch
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Helping millions of people worldwide check if their personal data has been
              compromised in data breaches. Free, secure, and trusted by security professionals.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/Virus2hell/MyLeakWatch" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noreferrer">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-300 hover:text-white transition-colors flex items-center" onClick={goEmailSearch}>
                  Email Search
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  Password Management
                </a>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors flex items-center" onClick={goImageSearch}>
                  Image Search
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors flex items-center" onClick={goDocs}>
                  Docs
                  <ExternalLink className="h-4 w-4 ml-1" />
                </button>
              </li>
            </ul>
          </div>

          {/* Team Members */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Team Members</h4>
            <ul className="space-y-2">
              <li><a className="text-gray-300 hover:text-white transition-colors">Sindhu Ade</a></li>
              <li><a className="text-gray-300 hover:text-white transition-colors">Shravan Kalambe</a></li>
              <li><a className="text-gray-300 hover:text-white transition-colors">Uday Mordharya</a></li>
              <li><a className="text-gray-300 hover:text-white transition-colors">Atharva Narvekar</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 MyLeakWatch. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">Made with security in mind 🔒</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
