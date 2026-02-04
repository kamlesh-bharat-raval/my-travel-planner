import React, { useState, useEffect } from "react";
import { Plane, Calendar, MapPin, Download, Trash2, X, ClipboardList, CheckCircle, Edit2, Save, Search, LayoutGrid } from "lucide-react";
import "./Saved.css";

export default function Saved() {
  const [savedItems, setSavedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({});

  // --- DATE LIMITS FOR VALIDATION ---
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 2); // 2 saal ki limit
  const maxDate = nextYear.toISOString().split('T')[0];

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
    setSavedItems(data);
    setFilteredItems(data); 
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    let results = savedItems.filter(item => {
      const searchStr = (item.name || item.title || item.destination || "").toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });

    if (activeFilter !== "all") {
      results = results.filter(item => item.type === activeFilter);
    }

    setFilteredItems(results);
  }, [searchTerm, activeFilter, savedItems]);

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditData({ ...item });
    setShowEditModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Basic Validation: Name/Title khali nahi hona chahiye
    const checkValue = editData.type === 'flight' ? editData.name : editData.title;
    if (!checkValue || checkValue.trim() === "") {
      alert("Please enter a valid name or title!");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
    const updated = existing.map(item => item.id === editData.id ? editData : item);
    localStorage.setItem("bookedTickets", JSON.stringify(updated));
    loadData();
    setShowEditModal(false);
    alert("Details updated successfully!");
  };

  const deleteItem = (id) => {
    if(window.confirm("Remove this from your library?")) {
      const existing = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
      const updated = existing.filter(item => item.id !== id);
      localStorage.setItem("bookedTickets", JSON.stringify(updated));
      loadData();
    }
  };

  const handlePrint = () => { window.print(); };

  return (
    <div className="saved-container">
      <div className="saved-header">
        <h1>Your Trip Library</h1>
        <p>Manage, search, and edit your travel bookings.</p>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, destination..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-tabs">
          <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => setActiveFilter('all')}>All</button>
          <button className={activeFilter === 'flight' ? 'active' : ''} onClick={() => setActiveFilter('flight')}><Plane size={14}/> Flights</button>
          <button className={activeFilter === 'plan' ? 'active' : ''} onClick={() => setActiveFilter('plan')}><ClipboardList size={14}/> Plans</button>
        </div>

        <div className="stats-badge">
          <LayoutGrid size={14}/> <span>{filteredItems.length} Items</span>
        </div>
      </div>

      {/* --- VIEW TICKET/PLAN MODAL --- */}
      {showModal && selectedItem && (
        <div className="modal-overlay ticket-mode">
          <div className="ticket-container animate-pop">
            <button className="close-ticket" onClick={() => setShowModal(false)}><X size={24}/></button>
            
            {selectedItem.type === 'flight' ? (
              <div className="boarding-pass" id="printable-ticket">
                <div className="ticket-left">
                  <div className="ticket-header">
                    <div className="brand"><Plane size={20} /> SKYLINE</div>
                    <div className="pass-type">BOARDING PASS</div>
                  </div>
                  <div className="path-row">
                    <div className="city-info"><h1>DEL</h1><p>DELHI</p></div>
                    <div className="plane-path"><Plane size={24} /></div>
                    <div className="city-info">
                      <h1>{selectedItem.destination?.substring(0, 3).toUpperCase()}</h1>
                      <p>{selectedItem.destination}</p>
                    </div>
                  </div>
                  <div className="ticket-info-grid">
                    <div className="info-item"><label>PASSENGER</label><span>{selectedItem.name}</span></div>
                    <div className="info-item"><label>DATE</label><span>{selectedItem.date}</span></div>
                    <div className="info-item"><label>SEAT</label><span>14A</span></div>
                    <div className="info-item"><label>PRICE</label><span>{selectedItem.price}</span></div>
                  </div>
                </div>
                <div className="ticket-right">
                  <div className="stub-header">STUB</div>
                  <div className="qr-code">QR</div>
                  <p className="stub-price">{selectedItem.price}</p>
                </div>
              </div>
            ) : (
              <div className="booking-modal" style={{background: 'white', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '500px'}}>
                <h3 style={{display: 'flex', gap: '10px', marginBottom: '10px'}}><ClipboardList color="#3b82f6"/> {selectedItem.title}</h3>
                <p><strong>Destination:</strong> {selectedItem.destination}</p>
                <p><strong>Date:</strong> {selectedItem.date}</p>
                <hr style={{margin: '15px 0', opacity: 0.2}}/>
                <p style={{fontSize: '0.9rem', color: '#64748b'}}>Itinerary details are saved in your planner hub.</p>
              </div>
            )}
            <button className="download-ticket-btn" onClick={handlePrint}><Download size={18} /> Print Copy</button>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL (WITH DATE FIX) --- */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="booking-modal animate-pop" style={{background: 'white', padding: '25px', borderRadius: '15px', width: '90%', maxWidth: '400px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
              <h3><Edit2 size={20}/> Edit {editData.type === 'flight' ? 'Ticket' : 'Plan'}</h3>
              <button onClick={() => setShowEditModal(false)} style={{border: 'none', background: 'none', cursor: 'pointer'}}><X/></button>
            </div>
            <form onSubmit={handleUpdate} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div className="form-group">
                <label style={{fontSize: '0.85rem', fontWeight: '600', color: '#64748b'}}>
                   {editData.type === 'flight' ? 'Passenger Name' : 'Trip Title'}
                </label>
                <input 
                  required
                  type="text" 
                  value={editData.type === 'flight' ? editData.name : editData.title} 
                  onChange={(e) => setEditData(editData.type === 'flight' ? {...editData, name: e.target.value} : {...editData, title: e.target.value})}
                  style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '5px'}}
                />
              </div>
              <div className="form-group">
                <label style={{fontSize: '0.85rem', fontWeight: '600', color: '#64748b'}}>Travel Date</label>
                <input 
                  required
                  type="date" 
                  min={today} // Past dates block
                  max={maxDate} // Crazy future dates block
                  value={editData.date} 
                  onChange={(e) => setEditData({...editData, date: e.target.value})} 
                  style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '5px'}} 
                />
              </div>
              <button type="submit" className="confirm-booking-btn" style={{marginTop: '10px'}}><Save size={18}/> Update Now</button>
            </form>
          </div>
        </div>
      )}

      {/* --- TICKETS GRID --- */}
      <div className="trips-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className={`trip-card ${item.type === 'flight' ? 'flight-border' : ''}`}>
              <div className={`trip-card-badge ${item.type === 'flight' ? 'badge-confirmed' : ''}`}>
                 {item.type === 'flight' ? <><CheckCircle size={14}/> Confirmed Ticket</> : <><ClipboardList size={14}/> Itinerary</>}
              </div>
              <div className="trip-info">
                <div className="trip-title-row">
                  <MapPin size={18} color={item.type === 'flight' ? "#10b981" : "#3b82f6"}/>
                  <h3>{item.type === 'flight' ? `Flight to ${item.destination}` : item.title}</h3>
                </div>
                <p><Calendar size={14}/> {item.date}</p>
                {item.type === 'flight' && <p><strong>Passenger:</strong> {item.name}</p>}
              </div>
              <div className="trip-actions">
                <button className="btn-edit-icon" title="Edit" onClick={() => openEditModal(item)}><Edit2 size={16}/></button>
                <button className="btn-download" onClick={() => {setSelectedItem(item); setShowModal(true);}}>
                  {item.type === 'flight' ? 'Show Ticket' : 'View Plan'}
                </button>
                <button className="btn-delete" title="Delete" onClick={() => deleteItem(item.id)}><Trash2 size={18}/></button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <Search size={48} color="#cbd5e1"/>
            <h3>No trips found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}