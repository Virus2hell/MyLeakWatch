import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutUs from './components/AboutUs';
//import StatsSection from './components/StatsSection';
import Footer from './components/Footer';
import ImageSearch from './components/ImageSearch';
import EmailChecker from './components/EmailChecker';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ImageSearch />
      <EmailChecker />
      <AboutUs />
      {/* <StatsSection /> */}
      <Footer />
    </div>
  );
}

export default App;