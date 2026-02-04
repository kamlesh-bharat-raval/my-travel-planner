import React from "react";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Details from "./pages/Details"; 
import Planner from "./pages/Planner"; 
import Saved from "./pages/Saved";         
import { Routes, Route, useNavigate } from "react-router-dom"; 
import { destinations } from "./data/destinations";
import Footer from './components/Footer'; 

export default function App() {
  const navigate = useNavigate(); 

  const handlePlan = (id) => {
    localStorage.setItem("travel_planner_selected", id);
    navigate("/planner");
  };

  return (
    <div className="app-wrapper">
      <Nav />

      {/* Main content area with min-height to push footer down */}
      <main style={{ minHeight: '85vh' }}>
        <Routes>
          <Route path="/" element={<Home destinations={destinations} />} /> 
          
          <Route
            path="/details/:id"
            element={
              <Details
                destinations={destinations}
                onPlan={handlePlan}
              />
            }
          />

          <Route path="/planner" element={<Planner />} />

          <Route
            path="/saved"
            element={<Saved destinations={destinations} />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}