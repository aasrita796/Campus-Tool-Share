import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import './Home.css';

const CATEGORIES = [
  { name: 'Calculators', emoji: '🧮', desc: 'Scientific & graphing' },
  { name: 'Electronics', emoji: '⚡', desc: 'Circuits & components' },
  { name: 'Lab Kits', emoji: '🔬', desc: 'Chemistry & biology' },
  { name: 'Books', emoji: '📚', desc: 'Textbooks & guides' },
  { name: 'Engineering Tools', emoji: '🔧', desc: 'Measurement & build' },
  { name: 'Gadgets', emoji: '📱', desc: 'Arduino, RPi & more' },
];

const HERO_SLIDES = [
  {
    tag: '🔥 Trending Now',
    title: 'Borrow smarter.',
    titleRed: 'Buy cheaper.',
    sub: 'Find tools from students around you. Save money, share resources.',
    cta: 'Explore Marketplace',
    bg: 'linear-gradient(135deg, #fff5f5 0%, #fff 50%, #fff0f0 100%)',
  },
  {
    tag: '💡 Share & Earn',
    title: 'Got tools',
    titleRed: 'collecting dust?',
    sub: 'List your lab kits, calculators, and gadgets. Earn while you study.',
    cta: 'Post Your Item',
    bg: 'linear-gradient(135deg, #f0f9ff 0%, #fff 50%, #fff0f0 100%)',
  },
  {
    tag: '🎓 Student Exclusive',
    title: 'Campus deals.',
    titleRed: 'Zero hassle.',
    sub: 'Every item is from a fellow student nearby. Verified & trusted community.',
    cta: 'Join CampusTS',
    bg: 'linear-gradient(135deg, #f0fff4 0%, #fff 50%, #fff0f0 100%)',
  },
];

const STATS = [
  { icon: <Users size={22} />, val: '5,000+', label: 'Students' },
  { icon: <TrendingUp size={22} />, val: '12,000+', label: 'Items Listed' },
  { icon: <Shield size={22} />, val: '100%', label: 'Verified Users' },
  { icon: <Zap size={22} />, val: '₹50 avg', label: 'Saved Per Borrow' },
];

export default function Home() {
  const [items, setItems] = useState([]);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/items?sort=latest').then(r => setItems(r.data.slice(0, 8))).catch(() => {});
    const timer = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const cur = HERO_SLIDES[slide];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero" style={{ background: cur.bg }}>
        <div className="hero-content">
          <div className="hero-tag fade-in">{cur.tag}</div>
          <h1 className="hero-title">
            {cur.title} <span>{cur.titleRed}</span>
          </h1>
          <p className="hero-sub">{cur.sub}</p>
          <div className="hero-btns">
            <Link to="/marketplace" className="btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
              {cur.cta} <ArrowRight size={18} />
            </Link>
            <Link to="/post" className="btn-outline" style={{ fontSize: '15px', padding: '14px 32px' }}>
              List an Item
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob" />
          <div className="hero-cards-float">
            <div className="float-card fc1">🧮<span>Calculator</span><strong>₹30/day</strong></div>
            <div className="float-card fc2">📚<span>Textbook</span><strong>₹20/day</strong></div>
            <div className="float-card fc3">🔬<span>Lab Kit</span><strong>₹60/day</strong></div>
          </div>
        </div>
        <div className="hero-nav">
          <button onClick={() => setSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}><ChevronLeft size={18} /></button>
          <div className="hero-dots">
            {HERO_SLIDES.map((_, i) => (
              <span key={i} className={`dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
            ))}
          </div>
          <button onClick={() => setSlide(s => (s + 1) % HERO_SLIDES.length)}><ChevronRight size={18} /></button>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-icon">{s.icon}</div>
                <div>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-sub">Everything a student needs, from one student to another.</p>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div
                key={cat.name}
                className="cat-card"
                onClick={() => navigate(`/marketplace?category=${cat.name}`)}
              >
                <div className="cat-emoji">{cat.emoji}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-desc">{cat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Fresh Drops 🔥</h2>
              <p className="section-sub">Latest items posted by students near you</p>
            </div>
            <Link to="/marketplace" className="btn-outline" style={{ padding: '10px 24px', fontSize: '13px', whiteSpace: 'nowrap' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-emoji">📦</div>
              <h3>No items yet</h3>
              <p>Be the first to list something!</p>
              <Link to="/post" className="btn-primary" style={{ marginTop: '16px' }}>Post an Item</Link>
            </div>
          ) : (
            <div className="items-grid">
              {items.map(item => <ItemCard key={item._id} item={item} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Got tools you don't use?</h2>
              <p>List them in 60 seconds and start earning from your campus community.</p>
              <Link to="/post" className="btn-primary" style={{ background: '#fff', color: 'var(--red)', padding: '14px 32px' }}>
                Post Your First Item <ArrowRight size={16} />
              </Link>
            </div>
            <div className="cta-emoji">🚀</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <div className="nav-logo" style={{ fontSize: '20px', marginBottom: '8px' }}>Campus<span style={{ color: 'var(--red)' }}>TS</span></div>
              <p style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '220px' }}>The exclusive marketplace for student tool sharing.</p>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/post">Post Item</Link>
              <Link to="/register">Sign Up</Link>
            </div>
            <div className="footer-links">
              <h4>Categories</h4>
              {CATEGORIES.slice(0,3).map(c => <Link key={c.name} to={`/marketplace?category=${c.name}`}>{c.name}</Link>)}
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2024 CampusTS. Built for students, by students.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
