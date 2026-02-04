import React from "react";
import { Link } from "react-router-dom";
import { Plane, ArrowRight } from "lucide-react"; // Icons for premium feel
import "./DestinationCard.css";

export default function DestinationCard({ item }) {
  return (
    <Link to={`/details/${item.id}`} className="dest-card">
      <div className="img-container">
        <img src={item.image} alt={item.name} className="dest-img" />
        {/* Flight Price Badge - Ye Sir ko dikhayega Ads ka kamaal */}
        <div className="flight-badge">
          <Plane size={14} />
          <span>Flights from {item.flightPrice}</span>
        </div>
      </div>
      
      <div className="dest-info">
        <div className="info-header">
          <h3>{item.name}</h3>
          <span className="location-tag">{item.location}</span>
        </div>
        <p className="short-desc">{item.short}</p>
        
        <div className="card-footer">
          <span className="view-deal">View Details</span>
          <ArrowRight size={16} className="arrow-icon" />
        </div>
      </div>
    </Link>
  );
}