import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ImageSearch from './components/ImageSearch';
import EmailChecker from './components/EmailChecker';
import Contact from './components/Contact';
import Docs from './components/Docs';
import BreachMonitor from './components/BreachMonitoring';
import { VisualMaps } from './components/dashboard/VisualMaps';
import { mockAttacks } from './data/mockAttackData';

function AppContent() {
  const location = useLocation();

  const HomeScreen = () => (
    <>
      <EmailChecker />
      <ImageSearch />
      <AboutUs />
      <Contact />
    </>
  );

  return (
    <div className="min-h-screen">
      {/* Removed onNavigate prop - Header handles router navigation internally */}
      <Header />

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/breach-monitor" element={<BreachMonitor />} />
        <Route path="/stats" element={<VisualMaps attacks={mockAttacks} />} />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
