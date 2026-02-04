import React, { useEffect, useState } from 'react';
import { 
  Plus, Trash2, MapPin, ChevronRight, CloudSun, CheckSquare, 
  Sparkles, PlaneTakeoff, Globe, User, Banknote, Share2
} from 'lucide-react'; 
import "./Planner.css"; 

const LS_KEY = 'travel_planner_trips_v1';

function loadTrips() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}

function TripEditor({ tripIndex, trip, addActivity, removeActivity, deleteTrip }) {
  const [text, setText] = useState('');
  const [dayIdx, setDayIdx] = useState(0);
  const budgetLimit = 10000;

  const calculateTotalSpent = () => {
    let total = 0;
    trip.days.forEach(day => {
      day.activities.forEach(act => {
        const priceMatch = act.text.match(/\d+/);
        if (priceMatch) total += parseInt(priceMatch[0]);
      });
    });
    return total;
  };

  const totalSpent = calculateTotalSpent();
  const percentage = Math.min((totalSpent / budgetLimit) * 100, 100);

  // LOGIC: Get Progress Bar Color
  const getBarColor = () => {
    if (percentage > 85) return "#ef4444";
    if (percentage > 60) return "#f59e0b";
    return "#10b981";
  };

  useEffect(() => { setDayIdx(0); }, [trip.id]);

  const handleAdd = () => {
    if(text.trim()){ 
        addActivity(tripIndex, dayIdx, text.trim()); 
        setText(''); 
    }
  };

  // NEW FEATURE: Share Itinerary via Clipboard
  const handleShare = () => {
    let shareText = `✈️ *MY TRAVEL PLAN: ${trip.title.toUpperCase()}*\n`;
    shareText += `👤 Passenger: ${trip.passengerName || 'Guest'}\n`;
    shareText += `📍 Destination: ${trip.base}\n`;
    shareText += `💰 Total Expenses: ₹${totalSpent}\n\n`;

    trip.days.forEach(day => {
      shareText += `📅 *DAY ${day.day}*\n`;
      if (day.activities.length === 0) {
        shareText += `   - No plans added yet\n`;
      } else {
        day.activities.forEach(act => {
          shareText += `   ✅ ${act.text}\n`;
        });
      }
      shareText += `\n`;
    });

    shareText += `_Created with Travel Planner_ 🚀`;

    navigator.clipboard.writeText(shareText).then(() => {
      alert("Itinerary copied! You can now paste and share it on WhatsApp. ✅");
    });
  };

  return (
    <div className="trip-editor-content animate-fade">
      <div className="editor-header-premium">
         <div className="header-left">
            <div className={`icon-bg ${trip.isImported ? 'imported-bg' : ''}`}>
              {trip.isImported ? <PlaneTakeoff size={24} /> : <MapPin size={24} />}
            </div>
            <div className="title-section">
              <h2 className="trip-main-title">{trip.title}</h2>
              <div className="meta-details">
                {trip.passengerName && (
                  <span className="passenger-tag"><User size={14} /> <span>{trip.passengerName}</span></span>
                )}
                <div className="location-subtitle"><Globe size={14} /> <span>{trip.base}</span></div>
              </div>
            </div>
         </div>
         <div className="header-actions no-print">
            {/* UPDATED: Share Button instead of Download */}
            <button onClick={handleShare} className="download-btn"><Share2 size={18} /> <span>Share Plan</span></button>
            <button onClick={() => deleteTrip(trip.id)} className="delete-trip-btn"><Trash2 size={18}/></button>
         </div>
      </div>

      <div className="insights-budget-container">
        <div className="insights-grid">
          <div className="insight-card">
            <CloudSun size={20} color="#fbbf24" />
            <div><p className="insight-label">Weather</p><p className="insight-value">Sunny, 24°C</p></div>
          </div>
          <div className="insight-card">
            <Banknote size={20} color="#10b981" />
            <div>
                <p className="insight-label">Spent / Limit</p>
                <p className="insight-value">₹{totalSpent} / ₹{budgetLimit}</p>
            </div>
          </div>
          <div className="insight-card">
            <CheckSquare size={20} color="#3b82f6" />
            <div>
                <p className="insight-label">Plans</p>
                <p className="insight-value">{trip.days.reduce((acc, d) => acc + d.activities.length, 0)} Items</p>
            </div>
          </div>
        </div>

        <div className="budget-progress-wrapper">
          <div className="progress-labels">
            <span>Budget Usage</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${percentage}%`, backgroundColor: getBarColor() }}></div>
          </div>
        </div>
      </div>

      <div className="quick-add-bar no-print">
        <select value={dayIdx} onChange={e=>setDayIdx(Number(e.target.value))} className="day-dropdown">
          {trip.days.map((d,i)=>(<option value={i} key={i}>Day {d.day}</option>))}
        </select>
        <div className="search-input-wrapper">
          <input 
              value={text} onChange={e=>setText(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Dinner - 500" 
          />
          <button className="add-activity-btn" onClick={handleAdd}><Plus size={20} /></button>
        </div>
      </div>

      <div className="timeline-container">
        {trip.days.map((d,i)=> (
          <div className="timeline-day-row" key={d.day}>
            <div className="timeline-sidebar">
              <span className="day-number">{d.day}</span>
              <div className="timeline-line"></div>
            </div>
            <div className="timeline-activities">
                {d.activities.length === 0 ? (
                  <div className="empty-activities-placeholder"><p>No plans yet for Day {d.day}</p></div>
                ) : (
                  <div className="activities-grid">
                      {d.activities.map(a=> {
                        const priceMatch = a.text.match(/(\d+)/);
                        const price = priceMatch ? priceMatch[0] : null;
                        const cleanText = price ? a.text.replace(price, "").replace(/-/g, "").trim() : a.text;
                        return (
                          <div key={a.id} className="modern-activity-card">
                              <p className="activity-text">{cleanText}</p>
                              {price && <span className="price-tag-mini">₹{price}</span>}
                              <button className="delete-activity-btn no-print" onClick={()=>removeActivity(tripIndex, i, a.id)}><Trash2 size={12} /></button>
                          </div>
                        )
                      })}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Planner() {
  const [trips, setTrips] = useState(loadTrips());
  const [title, setTitle] = useState('');
  const [days, setDays] = useState(3);
  const [activeTripIndex, setActiveTripIndex] = useState(null);

  useEffect(() => {
    const bookedFlights = JSON.parse(localStorage.getItem("bookedTickets") || "[]").filter(t => t.type === 'flight');
    setTrips(prev => {
      let updatedTrips = [...prev];
      let hasNewImport = false;
      bookedFlights.forEach(flight => {
        if (!updatedTrips.find(t => t.flightId === flight.id)) {
          updatedTrips = [{
            id: Date.now() + Math.random(),
            flightId: flight.id,
            title: `Trip to ${flight.destination}`,
            base: flight.destination,
            passengerName: flight.name || "Guest", 
            isImported: true,
            days: Array.from({length: 3}).map((_,i)=>({day: i+1, activities: []})),
            createdAt: new Date().toISOString()
          }, ...updatedTrips];
          hasNewImport = true;
        }
      });
      return hasNewImport ? updatedTrips : prev;
    });
  }, []);

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(trips)); }, [trips]);

  const createNew = () => {
    const newTrip = {
      id: Date.now(),
      title: title || 'New Adventure',
      base: 'Custom Location',
      days: Array.from({length: days}).map((_,i)=>({day: i+1, activities: []})),
      createdAt: new Date().toISOString()
    };
    setTrips(prev => [newTrip, ...prev]);
    setActiveTripIndex(0);
    setTitle('');
  };

  const deleteTrip = (id) => {
    if(window.confirm("Delete this plan?")) {
      setTrips(prev => prev.filter(t => t.id !== id));
      setActiveTripIndex(null);
    }
  };

  const addActivity = (tripIdx, dayIdx, text) => {
    setTrips(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[tripIdx].days[dayIdx].activities.push({id: Date.now(), text});
      return copy;
    });
  };

  const removeActivity = (tripIdx, dayIdx, actId) => {
    setTrips(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[tripIdx].days[dayIdx].activities = copy[tripIdx].days[dayIdx].activities.filter(a=>a.id !== actId);
      return copy;
    });
  };

  return (
    <div className="planner-dashboard">
      <aside className="planner-sidebar-modern no-print">
        <div className="sidebar-brand-box">
          <PlaneTakeoff size={28} />
          <h3>Trip Hub</h3>
        </div>
        <div className="sidebar-trip-list">
          {trips.map((t, idx) => (
            <div key={t.id} className={`sidebar-trip-card ${activeTripIndex === idx ? 'active' : ''}`} onClick={() => setActiveTripIndex(idx)}>
              <div className="card-info">
                <strong>{t.title}</strong>
                <span>{t.base} • {t.days.length}d</span>
              </div>
              <ChevronRight size={14} />
            </div>
          ))}
        </div>
      </aside>

      <main className="planner-workspace">
        {activeTripIndex === null ? (
          <div className="setup-container animate-fade">
              <div className="setup-card-advanced">
                <Sparkles size={40} color="#3b82f6" />
                <h2>New Journey</h2>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Trip Title" />
                <input type="number" value={days} onChange={e=>setDays(Math.max(1, Number(e.target.value)))} />
                <button className="start-planning-btn" onClick={createNew}>Create Plan</button>
              </div>
          </div>
        ) : (
          <TripEditor 
            key={trips[activeTripIndex].id} tripIndex={activeTripIndex} trip={trips[activeTripIndex]} 
            addActivity={addActivity} removeActivity={removeActivity} deleteTrip={deleteTrip}
          />
        )}
      </main>
    </div>
  );
}