import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Nav.css";

export default function Nav() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="logo">
            <span className="logo-icon">✈️</span>
            Travel<span className="logo-bold">Planner</span>
          </Link>
        </div>

        <div className="nav-right">
          <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/planner">
            Planner
          </NavLink>
          <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/saved">
            Saved Trips
          </NavLink>
        </div>
      </div>
    </nav>
  );
}