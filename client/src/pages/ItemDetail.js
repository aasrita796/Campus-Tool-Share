import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, User, Calendar, ArrowLeft, Eye, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import './ItemDetail.css';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [orderType, setOrderType] = useState('');
  const [borrowDays, setBorrowDays] = useState(1);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    axios.get(`/api/items/${id}`)
      .then(r => { setItem(r.data); setLoading(false); })
      .catch(() => { toast.error('Item not found'); navigate('/marketplace'); });
  }, [id]);

  const handleOrder = async (type) => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (item.owner._id === user._id || item.owner._id === user.id) {
      toast.error("You can't order your own item"); return;
    }
    setOrdering(true);
    try {
      await axios.post('/api/orders', {
        itemId: item._id,
        type,
        borrowDays: type === 'borrow' ? borrowDays : 1,
        startDate: new Date().toISOString()
      });
      toast.success(`${type === 'buy' ? 'Purchase' : 'Borrow'} request sent! 🎉`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Something went wrong');
    }
    setOrdering(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
      <div className="skeleton-card" style={{ width: '100%', maxWidth: '900px', height: '400px' }} />
    </div>
  );
  if (!item) return null;

  const imageUrl = (img) => img ? `http://localhost:5000${img}` : null;
  const total = orderType === 'buy' ? item.buyPrice : item.borrowPrice * borrowDays;

  return (
    <div className="item-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="detail-layout">
          {/* Images */}
          <div className="detail-images">
            <div className="main-img">
              {item.images?.[activeImg] ? (
                <img src={imageUrl(item.images[activeImg])} alt={item.name} />
              ) : (
                <div className="no-img">
                  {item.category === 'Calculators' ? '🧮' :
                   item.category === 'Electronics' ? '⚡' :
                   item.category === 'Lab Kits' ? '🔬' :
                   item.category === 'Books' ? '📚' :
                   item.category === 'Engineering Tools' ? '🔧' : '📱'}
                </div>
              )}
              <div className="img-badge">{item.condition}</div>
            </div>
            {item.images?.length > 1 && (
              <div className="thumb-row">
                {item.images.map((img, i) => (
                  <div key={i} className={`thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={imageUrl(img)} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-top">
              <span className="badge badge-red">{item.category}</span>
              {item.views > 0 && <span className="detail-views"><Eye size={13} /> {item.views} views</span>}
            </div>

            <h1 className="detail-title">{item.name}</h1>

            <div className="detail-prices">
              {item.allowBorrow && item.borrowPrice > 0 && (
                <div className="dp-box dp-borrow">
                  <span className="dp-label">Borrow</span>
                  <span className="dp-price">₹{item.borrowPrice}<small>/day</small></span>
                </div>
              )}
              {item.allowBuy && item.buyPrice > 0 && (
                <div className="dp-box dp-buy">
                  <span className="dp-label">Buy</span>
                  <span className="dp-price">₹{item.buyPrice}</span>
                </div>
              )}
            </div>

            <div className="detail-meta">
              <div className="dm-row"><User size={15} /><span><strong>{item.owner?.name}</strong></span></div>
              <div className="dm-row"><MapPin size={15} /><span>{item.location}</span></div>
              <div className="dm-row"><Calendar size={15} /><span>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
              <div className="dm-row"><Tag size={15} /><span>Condition: <strong>{item.condition}</strong></span></div>
            </div>

            <div className="detail-desc">
              <h3>About this item</h3>
              <p>{item.description}</p>
            </div>

            {/* Order section */}
            <div className="order-box">
              <h3>Place Request</h3>
              <div className="order-types">
                {item.allowBorrow && item.borrowPrice > 0 && (
                  <button
                    className={`ot-btn ${orderType === 'borrow' ? 'active' : ''}`}
                    onClick={() => setOrderType('borrow')}
                  >
                    Borrow — ₹{item.borrowPrice}/day
                  </button>
                )}
                {item.allowBuy && item.buyPrice > 0 && (
                  <button
                    className={`ot-btn ${orderType === 'buy' ? 'active' : ''}`}
                    onClick={() => setOrderType('buy')}
                  >
                    Buy — ₹{item.buyPrice}
                  </button>
                )}
              </div>

              {orderType === 'borrow' && (
                <div className="borrow-days">
                  <label>Borrow for how many days?</label>
                  <div className="days-row">
                    <button onClick={() => setBorrowDays(d => Math.max(1, d - 1))}>−</button>
                    <span>{borrowDays} day{borrowDays > 1 ? 's' : ''}</span>
                    <button onClick={() => setBorrowDays(d => d + 1)}>+</button>
                  </div>
                  <div className="total-row">
                    Total: <strong>₹{item.borrowPrice * borrowDays}</strong>
                  </div>
                </div>
              )}

              {orderType && (
                <button
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '14px' }}
                  disabled={ordering}
                  onClick={() => handleOrder(orderType)}
                >
                  {ordering ? 'Sending...' : `Send ${orderType === 'buy' ? 'Purchase' : 'Borrow'} Request`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
