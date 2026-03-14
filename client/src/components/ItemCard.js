import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Eye } from 'lucide-react';
import './ItemCard.css';

const CATEGORY_EMOJIS = {
  'Calculators': '🧮',
  'Electronics': '⚡',
  'Lab Kits': '🔬',
  'Books': '📚',
  'Engineering Tools': '🔧',
  'Gadgets': '📱',
};

const CONDITION_COLORS = {
  'New': 'badge-green',
  'Like New': 'badge-blue',
  'Good': 'badge-orange',
  'Fair': 'badge-red',
  'Poor': 'badge-red',
};

export default function ItemCard({ item }) {
  const emoji = CATEGORY_EMOJIS[item.category] || '📦';
  const condClass = CONDITION_COLORS[item.condition] || 'badge-orange';
  const imageUrl = item.images?.[0]
    ? `http://localhost:5000${item.images[0]}`
    : null;

  return (
    <Link to={`/item/${item._id}`} className="item-card">
      <div className="item-img-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} className="item-img" />
        ) : (
          <div className="item-img-placeholder">
            <span>{emoji}</span>
          </div>
        )}
        <div className="item-category-tag">{item.category}</div>
      </div>
      <div className="item-body">
        <h3 className="item-name">{item.name}</h3>
        <div className="item-owner">
          <div className="owner-avatar">{item.owner?.name?.[0]?.toUpperCase()}</div>
          <span>{item.owner?.name}</span>
        </div>
        <div className="item-location">
          <MapPin size={12} />
          <span>{item.location}</span>
        </div>
        <div className="item-meta">
          <span className={`badge ${condClass}`}>{item.condition}</span>
          {item.views > 0 && (
            <span className="item-views"><Eye size={11} /> {item.views}</span>
          )}
        </div>
        <div className="item-prices">
          {item.allowBorrow && item.borrowPrice > 0 && (
            <div className="price-borrow">
              <span className="price-label">Borrow</span>
              <span className="price-val">₹{item.borrowPrice}<small>/day</small></span>
            </div>
          )}
          {item.allowBuy && item.buyPrice > 0 && (
            <div className="price-buy">
              <span className="price-label">Buy</span>
              <span className="price-val">₹{item.buyPrice}</span>
            </div>
          )}
        </div>
        <div className="item-actions">
          {item.allowBorrow && (
            <span className="card-btn card-btn-outline">Borrow</span>
          )}
          {item.allowBuy && (
            <span className="card-btn card-btn-primary">Buy</span>
          )}
        </div>
      </div>
    </Link>
  );
}
