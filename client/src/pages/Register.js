import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '', college: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be 6+ characters'); return; }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome to CampusTS, ${res.data.user.name}! 🎉`);
      navigate('/');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed');
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
        <h2>Join CampusTS 🚀</h2>
        <p className="auth-sub">Create your account and start sharing</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Rahul Sharma" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@college.edu" required />
          </div>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Hyderabad" />
            </div>
            <div className="form-group">
              <label>College</label>
              <input name="college" value={form.college} onChange={handleChange} placeholder="BITS Hyderabad" />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="pass-wrap">
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min 6 characters" required />
              <button type="button" className="show-pass" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
      <div className="auth-visual">
        <div className="av-content">
          <div className="av-emoji">🤝</div>
          <h2>Share with your<br/>campus tribe.</h2>
          <p>List tools, earn money, help fellow students</p>
          <div className="av-tags">
            <span>🔧 Engineering Tools</span><span>📱 Gadgets</span>
            <span>🧮 Calculators</span><span>📚 Books</span>
          </div>
        </div>
      </div>
    </div>
  );
}
