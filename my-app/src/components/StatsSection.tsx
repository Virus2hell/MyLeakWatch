import React from 'react';
import { TrendingUp, Database } from 'lucide-react';

const StatsSection = () => {
  return (
    <section className="py-16 bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Breaches Stat */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <Database className="h-8 w-8 text-red-400 mr-3" />
              <span className="text-lg text-gray-300 font-medium">Total Data Breaches</span>
            </div>
            <div className="text-6xl sm:text-7xl font-bold text-white mb-4">903</div>
            <p className="text-gray-400 text-lg">
              Data breaches monitored and catalogued in our comprehensive database
            </p>
          </div>

          {/* Accounts Stat */}
          <div className="text-center lg:text-right">
            <div className="flex items-center justify-center lg:justify-end mb-4">
              <TrendingUp className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-lg text-gray-300 font-medium">Pwned Accounts</span>
            </div>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              15,098,981,649
            </div>
            <p className="text-gray-400 text-lg">
              Individual accounts that have been compromised across all breaches
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-8 border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Real-Time Monitoring</h3>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Our database is constantly updated as new breaches are discovered and verified. 
              We work with security researchers and organizations worldwide to ensure the most 
              comprehensive and up-to-date breach information is available to the public.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;