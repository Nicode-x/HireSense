import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import UploadForm from "../components/UploadForm";
import Results from "../components/Results";
import History from "../components/History";
import DashboardStats from "../components/DashboardStats";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const Home = () => {
  const [results, setResults] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div style={{ background: "#fefae0", color: "#3d3522", position: "relative", zIndex: 1 }}>
      <Navbar />
      <Hero />
      {isAuthenticated && (
        <ScrollReveal>
          <DashboardStats history={historyData} />
        </ScrollReveal>
      )}
      <ScrollReveal>
        <UploadForm setResults={setResults} />
      </ScrollReveal>
      {results && (
        <ScrollReveal>
          <Results data={results} />
        </ScrollReveal>
      )}
      {isAuthenticated && (
        <ScrollReveal>
          <History setHistoryData={setHistoryData} />
        </ScrollReveal>
      )}
      <Footer />
    </div>
  );
};

export default Home;