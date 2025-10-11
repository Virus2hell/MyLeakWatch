import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ImageSearch from './components/ImageSearch';
import EmailChecker from './components/EmailChecker';
import Contact from './components/Contact';
import Docs from './components/Docs';
import VaultPage from './components/PasswordManager/VaultPage';

type Page = 'home' | 'docs';

function App() {
  const [page, setPage] = useState<Page>('home');

  const HomeScreen = () => (
    <>
      <EmailChecker />
      <ImageSearch />
      <AboutUs />
      <Contact />
    </>
  );

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header onNavigate={setPage} currentPage={page} />

        <Routes>
          {/* Keep SPA-style sections controlled by page state */}
          <Route path="/" element={page === 'home' ? <HomeScreen /> : <Docs />} />
          {/* Explicit docs path if someone navigates directly */}
          <Route path="/docs" element={<Docs />} />
          {/* Password Manager route */}
          <Route path="/vault" element={<VaultPage />} />
        </Routes>

        <Footer onNavigate={setPage} currentPage={page} />
      </div>
    </BrowserRouter>
  );
}

export default App;
