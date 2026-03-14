import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, MapPin } from 'lucide-react';
import './MyListings.css';

const CATEGORY_EMOJIS = {
  'Calculators': '🧮', 'Electronics': '⚡', 'Lab Kits': '🔬',
  'Books': '📚', 'Engineering Tools': '🔧', 'Gadgets': '📱',
};

export default function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/items/my')
      .then(r => { setItems(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(`/api/items/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Item deleted');
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const res = await axios.put(`/api/items/${item._id}`, { isAvailable: !item.isAvailable });
      setItems(prev => prev.map(i => i._id === item._id ? res.data : i));
      toast.success(`Item marked as ${res.data.isAvailable ? 'available' : 'unavailable'}`);
    } catch (e) { toast.error('Update failed'); }
  };

  return (
    <div className="my-listings-page">
      <div className="container">
        <div className="ml-header">
          <div>
            <h1>My Listings</h1>
            <p>{items.length} item{items.length !== 1 ? 's' : ''} posted</p>
          </div>
          <Link to="/post" className="btn-primary" style={{ padding: '12px 24px' }}>
            <Plus size={16} /> Post New Item
          </Link>
        </div>

        {loading ? (
          <div className="ml-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" style={{ height: '240px' }} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">📦</div>
            <h3>No listings yet</h3>
            <p>Post your first item and start earning!</p>
            <Link to="/post" className="btn-primary" style={{ marginTop: '20px' }}>
              <Plus size={16} /> Post an Item
            </Link>
          </div>
        ) : (
          <div className="ml-grid">
            {items.map(item => {
              const emoji = CATEGORY_EMOJIS[item.category] || '📦';
              const imgUrl = item.images?.[0] ? `http://localhost:5000${item.images[0]}` : null;
              return (
                <div key={item._id} className={`ml-card ${!item.isAvailable ? 'unavailable' : ''}`}>
                  <div className="ml-img-wrap">
                    {imgUrl ? (
                      <img src={imgUrl} alt={item.name} />
                    ) : (
                      <div className="ml-img-placeholder">{emoji}</div>
                    )}
                    <div className={`avail-badge ${item.isAvailable ? 'avail' : 'unavail'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  <div className="ml-body">
                    <h3>{item.name}</h3>
                    <div className="ml-meta">
                      <span className="badge badge-red" style={{ fontSize: '11px' }}>{item.category}</span>
                      <span className="badge badge-orange" style={{ fontSize: '11px' }}>{item.condition}</span>
                    </div>
                    <div className="ml-location"><MapPin size={12} />{item.location}</div>
                    <div className="ml-prices">
                      {item.allowBorrow && <span>🔄 ₹{item.borrowPrice}/day</span>}
                      {item.allowBuy && <span>🛒 ₹{item.buyPrice}</span>}
                    </div>
                    <div className="ml-views"><Eye size={12} /> {item.views} views</div>
                    <div className="ml-actions">
                      <button className="ml-btn ml-view" onClick={() => navigate(`/item/${item._id}`)}>
                        <Eye size={14} />
                      </button>
                      <button
                        className={`ml-btn ${item.isAvailable ? 'ml-toggle-off' : 'ml-toggle-on'}`}
                        onClick={() => toggleAvailability(item)}
                        title={item.isAvailable ? 'Mark unavailable' : 'Mark available'}
                      >
                        {item.isAvailable ? 'Hide' : 'Show'}
                      </button>
                      <button className="ml-btn ml-delete" onClick={() => handleDelete(item._id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
