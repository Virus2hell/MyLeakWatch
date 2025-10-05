import React, { useState } from 'react';
import Header from './components/Header';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ImageSearch from './components/ImageSearch';
import EmailChecker from './components/EmailChecker';
import Contact from './components/Contact';
import Docs from './components/Docs';

type Page = 'home' | 'docs';

function App() {
  const [page, setPage] = useState<Page>('home');

  return (
    <div className="min-h-screen">
      <Header onNavigate={setPage} currentPage={page} />
      {page === 'home' && (
        <>
          <EmailChecker />
          <ImageSearch />
          <AboutUs />
          <Contact />
        </>
      )}
      {page === 'docs' && <Docs />}
      <Footer />
    </div>
  );
}

export default App;
