import React from 'react';
import Header from './components/Header';
//import HeroSection from './components/HeroSection';
import AboutUs from './components/AboutUs';
//import StatsSection from './components/StatsSection';
import Footer from './components/Footer';
import ImageSearch from './components/ImageSearch';
import EmailChecker from './components/EmailChecker';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      {/* <HeroSection /> */}
      <EmailChecker />
      <ImageSearch />
      <AboutUs />
      {/* <StatsSection /> */}
      <Contact />
      <Footer />
    </div>
  );
}

export default App;