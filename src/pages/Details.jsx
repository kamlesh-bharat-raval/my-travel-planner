import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Plane, Hotel, Star, ShieldCheck, ArrowRight, Loader2, X, User, Users, Calendar, Download, Map as MapIcon } from "lucide-react";
import Map from "../components/Map"; 
import "./Details.css";

export default function Details({ destinations, onPlan }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [passengerData, setPassengerData] = useState({ name: '', date: '', guests: 1 });

  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const maxDate = nextYear.toISOString().split('T')[0];

  const place = destinations.find((d) => d.id === Number(id));

  if (!place) return <div className="not-found"><h2>Destination not found</h2></div>;

  const handleFinalBooking = (e) => {
    e.preventDefault();
    setLoading(true);
    setShowForm(false);
    setIsFlying(true);

    const newTicket = {
      id: Date.now(),
      type: 'flight',
      name: passengerData.name, 
      passenger: passengerData.name,
      date: passengerData.date,
      destination: place.name,
      price: place.flightPrice,
      guests: passengerData.guests
    };

    const existing = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
    localStorage.setItem("bookedTickets", JSON.stringify([...existing, newTicket]));

    setTimeout(() => {
      setLoading(false);
      setIsFlying(false);
      setShowSuccess(true);
    }, 2500);
  };

  const handleHotelBooking = (hotelName) => {
    const confirmBox = window.confirm(`Do you want to check availability for ${hotelName}?`);
    if (confirmBox) {
      window.open(`https://www.booking.com/searchresults.html?ss=${hotelName}+${place.name}`, "_blank");
    }
  };

  const handleDownload = () => { window.print(); };

  return (
    <div className="details-container">
      {isFlying && (
        <div className="flying-overlay">
          <div className="plane-animation-content">
            <Plane size={80} className="taking-off-plane" />
            <div className="cloud-1">☁️</div>
            <div className="cloud-2">☁️</div>
            <h2 className="flying-text">Booking Your Seat to {place.name}...</h2>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="modal-overlay ticket-mode">
          <div className="ticket-container animate-pop">
            <button className="close-ticket" onClick={() => setShowSuccess(false)}><X size={24}/></button>
            <div className="boarding-pass" id="printable-ticket">
              <div className="ticket-left">
                <div className="ticket-header">
                  <div className="brand"><Plane size={20} /> SKYLINE AIRWAYS</div>
                  <div className="pass-type">BOARDING PASS</div>
                </div>
                <div className="path-row">
                  <div className="city-info"><h1>DEL</h1><p>DELHI, IN</p></div>
                  <div className="plane-path"><Plane size={28} /></div>
                  <div className="city-info">
                    <h1>{place.name.substring(0, 3).toUpperCase()}</h1>
                    <p>{place.name.toUpperCase()}</p>
                  </div>
                </div>
                <div className="ticket-info-grid">
                  <div className="info-item"><label><User size={10}/> PASSENGER</label><span>{passengerData.name || 'GUEST'}</span></div>
                  <div className="info-item"><label><Calendar size={10}/> DATE</label><span>{passengerData.date || 'TBD'}</span></div>
                  <div className="info-item"><label><Users size={10}/> GUESTS</label><span>{passengerData.guests}</span></div>
                </div>
              </div>
              <div className="ticket-right">
                <div className="stub-header">STUB</div>
                <div className="qr-code">QR</div>
                <p className="stub-price">{place.flightPrice}</p>
              </div>
            </div>
            <button className="download-ticket-btn" onClick={handleDownload}><Download size={18} /> Print Ticket</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="booking-modal animate-pop">
            <button className="close-modal" onClick={() => setShowForm(false)}><X size={20}/></button>
            <div className="modal-header"><Plane size={24} color="#3b82f6"/><h3>Booking Details</h3></div>
            <form onSubmit={handleFinalBooking} className="modal-form">
              <div className="form-group-modal">
                <label><User size={14}/> Full Name</label>
                <input required type="text" placeholder="Enter name" onChange={(e) => setPassengerData({...passengerData, name: e.target.value})} />
              </div>
              <div className="form-row-modal">
                <div className="form-group-modal">
                  <label><Calendar size={14}/> Travel Date</label>
                  <input 
                    required 
                    type="date" 
                    min={today} 
                    max={maxDate}
                    onChange={(e) => setPassengerData({...passengerData, date: e.target.value})} 
                  />
                </div>
                <div className="form-group-modal">
                  <label><Users size={14}/> Guests</label>
                  <input required type="number" min="1" max="10" defaultValue="1" onChange={(e) => setPassengerData({...passengerData, guests: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="confirm-booking-btn">Confirm My Seat</button>
            </form>
          </div>
        </div>
      )}

      <div className="details-main">
        <div className="details-hero">
          <img src={place.image} alt={place.name} className="details-img" />
          <div className="hero-overlay"><span className="location-badge">{place.location}</span></div>
        </div>
        <div className="details-content">
          <div className="details-header">
            <h2>{place.name}</h2>
            <p className="description-text">{place.description}</p>
          </div>
          
          <div className="info-grid">
            <div className="info-card"><ShieldCheck color="#10b981" /><span>Safe Travel</span></div>
            <div className="info-card"><Plane color="#3b82f6" /><span>Direct Flight</span></div>
          </div>

          {/* Map Section */}
          {place.coords && (
            <div className="map-section" style={{ margin: "40px 0" }}>
              <h3 style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                <MapIcon size={20} /> Explore the Area
              </h3>
              <Map coords={place.coords} locationName={place.name} />
            </div>
          )}

          <div className="hotels-section">
            <h3><Hotel size={20} /> Recommended Stays</h3>
            <div className="hotel-grid">
              {place.hotels?.map((hotel, index) => (
                <div key={index} className="hotel-ad-card">
                  <div className="hotel-info">
                    <h4>{hotel.name}</h4>
                    <div className="rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span>{hotel.rating}</span>
                    </div>
                    <p className="hotel-price">{hotel.price}</p>
                  </div>
                  <button onClick={() => handleHotelBooking(hotel.name)} className="hotel-book-btn">Book Room</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <aside className="details-sidebar">
        <div className="booking-card">
          <div className="flight-deal-header"><Plane size={20} /><h4>Flight Deal</h4></div>
          <div className="price-tag"><span className="from-text">From</span><span className="main-price">{place.flightPrice}</span></div>
          <button className={`book-flight-btn ${loading ? 'loading' : ''}`} onClick={() => setShowForm(true)} disabled={loading}>
            {loading ? <><Loader2 className="spinner" size={18} /> Booking...</> : "Book Ticket"}
          </button>
        </div>
        <button className="plan-full-btn" onClick={() => onPlan(place.id)}>Plan Itinerary <ArrowRight size={18} /></button>
      </aside>
    </div>
  );
}