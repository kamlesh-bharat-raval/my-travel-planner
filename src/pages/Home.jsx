import React, { useState } from "react";
import DestinationCard from "../components/DestinationCard";
import "./Home.css"; 

export default function Home({ destinations }) { 
  const [q, setQ] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  const dataToFilter = destinations || []; 

  const filtered = dataToFilter.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(q.toLowerCase()) || 
                          d.base?.toLowerCase().includes(q.toLowerCase());
    const matchesFilter = activeFilter === "All" || d.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const categories = ["All", "Beach", "Mountain", "City", "Heritage"];

  return (
    <section className="home">
      <div className="home-hero-bg">
        <div className="home-container">
          <div className="hero-content">
            <h1 className="animate-fade-up">Plan your next trip</h1>
            <p className="subtitle">Search destinations, book flights, and build your dream itinerary.</p>

            <div className="search-row">
              <div className="search-pill-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  value={q}
                  onChange={(e) => {setQ(e.target.value); setActiveFilter("All");}}
                  placeholder="Where do you want to go?"
                  className="premium-search"
                />
                {q && <button className="clear-search" onClick={() => setQ("")}>✕</button>}
              </div>
            </div>

            <div className="category-filters no-print">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => {setActiveFilter(cat); setQ("");}}
                  className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="home-container grid-section">
        <div className="grid-header">
          <div className="header-title-box">
              <h2>{q ? `Results for "${q}"` : activeFilter !== "All" ? `${activeFilter} Getaways` : "Featured Destinations"}</h2>
              <p className="grid-subtitle">Handpicked places for your next adventure</p>
          </div>
          <span className="count-badge">{filtered.length} places available</span>
        </div>

        <div className="grid">
          {filtered.length > 0 ? (
            filtered.map((dest, index) => (
              <div key={dest.id} className="card-animation-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                <DestinationCard item={dest} /> 
              </div>
            ))
          ) : (
            <div className="no-results-box">
              <div className="no-results-icon">🏝️</div>
              <h3>No destinations found</h3>
              <p>Try resetting the filters or searching for something else.</p>
              <button onClick={() => {setQ(""); setActiveFilter("All");}} className="reset-btn">Explore All</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}