import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutUs from './components/AboutUs';
//import StatsSection from './components/StatsSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutUs />
      {/* <StatsSection /> */}
      <Footer />
    </div>
  );
}

export default App;