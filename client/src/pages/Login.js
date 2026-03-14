import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate('/');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">Campus<span>TS</span></Link>
          <p>Campus Tool Share</p>
        </div>
        <h2>Welcome back 👋</h2>
        <p className="auth-sub">Log in to access the campus marketplace</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="pass-wrap">
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="••••••••" required />
              <button type="button" className="show-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Sign up free</Link></p>
      </div>
      <div className="auth-visual">
        <div className="av-content">
          <div className="av-emoji">🎓</div>
          <h2>Borrow smarter.<br/>Buy cheaper.</h2>
          <p>Join 5,000+ students sharing tools on campus</p>
          <div className="av-tags">
            <span>🧮 Calculators</span><span>⚡ Electronics</span>
            <span>🔬 Lab Kits</span><span>📚 Books</span>
          </div>
        </div>
      </div>
    </div>
  );
}
