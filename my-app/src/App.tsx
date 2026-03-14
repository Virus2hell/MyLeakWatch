import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import Footer from "./components/Footer";
import ImageSearch from "./components/ImageSearch";
import EmailChecker from "./components/EmailChecker";
import Contact from "./components/Contact";
import Docs from "./components/Docs";
import BreachMonitor from "./components/BreachMonitoring";

import { VisualMaps } from "./components/dashboard/VisualMaps";

import { AttackEvent } from "./types/attack";

function AppContent() {
  const location = useLocation();

  const [attacks, setAttacks] = useState<AttackEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | undefined>();

  const fetchAttacks = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/api/attacks");

      const data = await res.json();

      const formatted = data.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      }));

      setAttacks(formatted);
      setLastFetched(new Date());
    } catch (error) {
      console.error("Failed to fetch attacks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttacks();

    const interval = setInterval(fetchAttacks, 60000);

    return () => clearInterval(interval);
  }, []);

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
      <Header />

      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/breach-monitor" element={<BreachMonitor />} />

        <Route
          path="/stats"
          element={
            <VisualMaps
              attacks={attacks}
              lastFetched={lastFetched}
              isLoading={loading}
              dataSource="live"
              onRefresh={fetchAttacks}
            />
          }
        />
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