import React from 'react';
import {LucideImagePlus, LucideLockKeyhole, Brain, LucideMailSearch } from 'lucide-react';

const AboutUs = () => {
  const features = [
    {
      icon: LucideMailSearch,
      title: 'Email breach check',
      description: 'Fast lookups powered by licensed breach data and HIBP-compatible endpoints, with clear breach details and privacy-first processing.'
    },
    {
      icon: LucideImagePlus,
      title: 'Image search',
      description: 'Reverse image scanning to spot unauthorized reuse of photos/avatars using provider integrations and perceptual hashing for quick matches.'
    },
    {
      icon: LucideLockKeyhole,
      title: 'Password management',
      description: 'Securely save passwords in an encrypted vault and access them with email-based OTP for quick, code‑verified unlocks across sessions.'
    },
    {
      icon: Brain,
      title: 'Chat with AI',
      description: 'On‑site assistant that explains breach results, prioritizes what to fix, and walks through step‑by‑step remediation in plain language.'
    },
    {
      icon: Brain,
      title: 'Password Checker',
      description: 'Instantly evaluate password strength and reuse with local hashing and guidance to create safer alternatives.'
    },
    {
      icon: Brain,
      title: 'Docs',
      description: 'Quick, plain-language guides on breaches, prevention, and post-incident steps, plus FAQs and checklists for fast action.'
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            About <span className="text-blue-400">My</span>LeakWatch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            MyLeakWatch is a free resource for anyone to quickly assess if they may have been 
            put at risk due to an online account of theirs having been compromised or "pwned" in a data breach.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl p-8 mb-16 border border-blue-500/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              We believe that everyone deserves to know when their personal information has been exposed 
              in data breaches. Our platform provides this crucial information for free, helping 
              people protect themselves online and make informed decisions about their digital security.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-slate-700/30 rounded-2xl p-8 border border-slate-600/30">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">How It Started</h3>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-gray-300 mb-6 leading-relaxed">
                MyLeakWatch began as a personal initiative to combat the growing threat of data breaches and unauthorized 
                image leaks online, inspired by tools like Have I Been Pwned but designed with a broader scope to include 
                visual content monitoring. The project was conceived to empower users with real-time alerts and actionable 
                insights when their personal data or images appear in compromised databases or surface on the web without consent.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                The idea emerged from recognizing gaps in existing breach detection services, which often focus solely on email 
                and password leaks while overlooking image-based exposure. With increasing incidents of deepfakes, non-consensual sharing, and social media leaks, the need for a tool that 
                could proactively scan and notify users about leaked visual content became evident.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;