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

import { AttackEvent, AttackTrend } from "./types/attack";

import { fetchAttackTrends } from "./api/trendsApi";

function AppContent() {
  const location = useLocation();

  const [attacks, setAttacks] = useState<AttackEvent[]>([]);
  const [news, setNews] = useState<AttackEvent[]>([]);
  const [trends, setTrends] = useState<AttackTrend[]>([]);

  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | undefined>();

  const fetchAttacks = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/attacks");

      const data = await res.json();

      const formatted = data.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp)
      }));

      setAttacks(formatted);

    } catch (error) {
      console.error("Failed to fetch attacks", error);
    }
  };

  const fetchCyberNews = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/cyber-news");

      const data = await res.json();

      const formatted = data.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));

      setNews(formatted);

    } catch (error) {
      console.error("Failed to fetch cyber news", error);
    }
  };

  const fetchTrends = async () => {
    try {
      const data = await fetchAttackTrends();
      setTrends(data);
    } catch (error) {
      console.error("Failed to fetch trends", error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchAttacks(),
        fetchCyberNews(),
        fetchTrends()
      ]);

      setLastFetched(new Date());

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 60000);

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
              news={news}
              trends={trends}
              lastFetched={lastFetched}
              isLoading={loading}
              dataSource="live"
              onRefresh={loadData}
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