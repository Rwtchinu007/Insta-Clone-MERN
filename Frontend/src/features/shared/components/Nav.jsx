import React from "react";
import "../nav.scss";
import { useNavigate, useLocation } from "react-router"; // Make sure to use react-router-dom

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check if the current path is active
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        
        {/* ── Logo ── */}
        <div className="logo" onClick={() => navigate("/")}>
          Instagram
        </div>

        {/* ── Icon Actions ── */}
        <div className="nav-actions">
          
          {/* Home Icon */}
          <button 
            className={`icon-btn ${isActive("/")}`} 
            onClick={() => navigate("/")}
            aria-label="Home"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>

          {/* Create Post Icon */}
          <button 
            className={`icon-btn ${isActive("/create-post")}`} 
            onClick={() => navigate("/create-post")}
            aria-label="New Post"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>

          {/* Profile Icon */}
          <button 
            className={`icon-btn ${isActive("/profile")}`} 
            onClick={() => navigate("/profile")}
            aria-label="Profile"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Nav;