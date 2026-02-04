import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet default icon fix (kuch systems me icon gayab ho jata hai)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Map({ coords, locationName }) {
  return (
    <div style={{ height: "300px", width: "100%", borderRadius: "15px", overflow: "hidden", marginTop: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <MapContainer center={coords} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords}>
          <Popup>
            {locationName} <br /> Your next adventure!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}