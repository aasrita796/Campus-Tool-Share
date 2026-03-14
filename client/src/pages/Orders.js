import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Package, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import './Orders.css';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'badge-orange', icon: <Clock size={13} /> },
  accepted: { label: 'Accepted', color: 'badge-green', icon: <CheckCircle size={13} /> },
  rejected: { label: 'Rejected', color: 'badge-red', icon: <XCircle size={13} /> },
  completed: { label: 'Completed', color: 'badge-blue', icon: <CheckCircle size={13} /> },
  returned: { label: 'Returned', color: 'badge-green', icon: <RefreshCw size={13} /> },
};

export default function Orders() {
  const [tab, setTab] = useState('my');
  const [myOrders, setMyOrders] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [myRes, inRes] = await Promise.all([
        axios.get('/api/orders/my'),
        axios.get('/api/orders/incoming'),
      ]);
      setMyOrders(myRes.data);
      setIncoming(inRes.data);
    } catch (e) { toast.error('Failed to load orders'); }
    setLoading(false);
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      toast.success(`Order ${status}!`);
      fetchAll();
    } catch (e) { toast.error('Update failed'); }
  };

  const orders = tab === 'my' ? myOrders : incoming;

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>Orders</h1>
          <p>Track your borrow requests and purchases</p>
        </div>

        <div className="orders-tabs">
          <button className={`o-tab ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>
            My Orders <span className="o-count">{myOrders.length}</span>
          </button>
          <button className={`o-tab ${tab === 'incoming' ? 'active' : ''}`} onClick={() => setTab('incoming')}>
            Incoming Requests <span className="o-count">{incoming.length}</span>
          </button>
        </div>

        {loading ? (
          <div className="orders-loading">
            {[...Array(3)].map((_, i) => <div key={i} className="order-skeleton" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state" style={{ marginTop: '32px' }}>
            <div className="empty-emoji"><Package size={48} /></div>
            <h3>No {tab === 'my' ? 'orders' : 'incoming requests'} yet</h3>
            <p>{tab === 'my' ? 'Browse the marketplace to find something!' : 'Share your listings to get requests.'}</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const imgUrl = order.item?.images?.[0] ? `http://localhost:5000${order.item.images[0]}` : null;
              return (
                <div key={order._id} className="order-card">
                  <div className="oc-img">
                    {imgUrl ? <img src={imgUrl} alt={order.item?.name} /> : <Package size={28} />}
                  </div>
                  <div className="oc-info">
                    <div className="oc-top">
                      <h3>{order.item?.name}</h3>
                      <span className={`badge ${sc.color}`}>{sc.icon} {sc.label}</span>
                    </div>
                    <div className="oc-meta">
                      <span className={`order-type-badge ${order.type}`}>{order.type === 'buy' ? '🛒 Buy' : '🔄 Borrow'}</span>
                      {order.type === 'borrow' && <span>{order.borrowDays} day{order.borrowDays > 1 ? 's' : ''}</span>}
                      <span>₹{order.totalAmount}</span>
                      {tab === 'my' && <span>from {order.seller?.name}</span>}
                      {tab === 'incoming' && <span>by {order.buyer?.name}</span>}
                    </div>
                    <div className="oc-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  {tab === 'incoming' && order.status === 'pending' && (
                    <div className="oc-actions">
                      <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}
                        onClick={() => updateStatus(order._id, 'accepted')}>Accept</button>
                      <button className="btn-outline" style={{ padding: '8px 18px', fontSize: '13px' }}
                        onClick={() => updateStatus(order._id, 'rejected')}>Reject</button>
                    </div>
                  )}
                  {tab === 'incoming' && order.status === 'accepted' && order.type === 'borrow' && (
                    <div className="oc-actions">
                      <button className="btn-outline" style={{ padding: '8px 18px', fontSize: '13px' }}
                        onClick={() => updateStatus(order._id, 'returned')}>Mark Returned</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
