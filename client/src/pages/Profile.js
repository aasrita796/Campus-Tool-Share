import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, login, token } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    location: user?.location || '',
    college: user?.college || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/api/users/me', form);
      login(res.data, token);
      toast.success('Profile updated! ✅');
    } catch (e) {
      toast.error('Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="profile-avatar-big">{user?.name?.[0]?.toUpperCase()}</div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            {user?.college && <span className="profile-college">{user.college}</span>}
            {user?.location && <span className="profile-loc">📍 {user.location}</span>}
          </div>
          <div className="profile-main">
            <h3>Edit Profile</h3>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="City, Area" />
              </div>
              <div className="form-group">
                <label>College</label>
                <input name="college" value={form.college} onChange={handleChange} placeholder="Your college name" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXXXXXXX" />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '13px 32px' }} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
