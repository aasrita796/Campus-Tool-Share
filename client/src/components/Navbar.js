import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Bell, MessageCircle, Settings, LogOut, User, Package, ListChecks, MapPin, Search, ChevronDown, Plus, Menu, X } from 'lucide-react';
import './Navbar.css';

const CATEGORIES = ['All', 'Calculators', 'Electronics', 'Lab Kits', 'Books', 'Engineering Tools', 'Gadgets'];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [profileOpen, setProfileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef();
  const catRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/marketplace?search=${search}&category=${category}`);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-top">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            Campus<span>TS</span>
          </Link>
          {user && (
            <div className="nav-location">
              <MapPin size={13} />
              <div>
                <span className="loc-label">Deliver to</span>
                <span className="loc-value">{user.location || 'Hyderabad'}</span>
              </div>
            </div>
          )}
        </div>

        <form className="nav-search" onSubmit={handleSearch}>
          <div className="search-cat" ref={catRef} onClick={() => setCatOpen(!catOpen)}>
            <span>{category === 'All' ? 'All' : category.slice(0, 6)}</span>
            <ChevronDown size={14} />
            {catOpen && (
              <div className="cat-dropdown">
                {CATEGORIES.map(c => (
                  <div key={c} className={`cat-item ${category === c ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setCategory(c); setCatOpen(false); }}>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for calculators, books, lab kits..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <Search size={18} />
          </button>
        </form>

        <div className="nav-right">
          <Link to="/post" className="btn-post">
            <Plus size={16} />
            <span>Post Item</span>
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="nav-icon-btn" title="Orders">
                <Package size={20} />
              </Link>
              <button className="nav-icon-btn" title="Messages">
                <MessageCircle size={20} />
              </button>
              <div className="profile-wrap" ref={profileRef}>
                <button className="nav-avatar" onClick={() => setProfileOpen(!profileOpen)}>
                  <div className="avatar-circle">{user.name?.[0]?.toUpperCase()}</div>
                  <ChevronDown size={14} />
                </button>
                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="pd-header">
                      <div className="pd-avatar">{user.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div className="pd-name">{user.name}</div>
                        <div className="pd-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="pd-divider" />
                    <Link to="/profile" className="pd-item" onClick={() => setProfileOpen(false)}>
                      <User size={16} /> My Profile
                    </Link>
                    <Link to="/my-listings" className="pd-item" onClick={() => setProfileOpen(false)}>
                      <ListChecks size={16} /> My Listings
                    </Link>
                    <Link to="/orders" className="pd-item" onClick={() => setProfileOpen(false)}>
                      <Package size={16} /> Orders
                    </Link>
                    <Link to="/profile" className="pd-item" onClick={() => setProfileOpen(false)}>
                      <Settings size={16} /> Settings
                    </Link>
                    <div className="pd-divider" />
                    <button className="pd-item pd-logout" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn-outline" style={{ padding: '9px 20px', fontSize: '13px' }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '9px 20px', fontSize: '13px' }}>Sign Up</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      {mobileOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." />
            <button type="submit"><Search size={16} /></button>
          </form>
          <div className="mobile-links">
            <Link to="/marketplace" onClick={() => setMobileOpen(false)}>Marketplace</Link>
            <Link to="/post" onClick={() => setMobileOpen(false)}>Post Item</Link>
            {user ? (
              <>
                <Link to="/my-listings" onClick={() => setMobileOpen(false)}>My Listings</Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)}>Orders</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
