import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import { SlidersHorizontal, Search } from 'lucide-react';
import './Marketplace.css';

const CATEGORIES = ['All', 'Calculators', 'Electronics', 'Lab Kits', 'Books', 'Engineering Tools', 'Gadgets'];
const SORTS = [
  { label: 'Newest First', val: 'latest' },
  { label: 'Price: Low to High', val: 'price_asc' },
  { label: 'Price: High to Low', val: 'price_desc' },
];

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('latest');
  const [filterType, setFilterType] = useState('all');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      params.append('sort', sort);
      const res = await axios.get(`/api/items?${params}`);
      let data = res.data;
      if (filterType === 'borrow') data = data.filter(i => i.allowBorrow);
      if (filterType === 'buy') data = data.filter(i => i.allowBuy);
      setItems(data);
    } catch (e) { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [category, sort, filterType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="marketplace">
      <div className="mp-header">
        <div className="container">
          <h1>Marketplace</h1>
          <p>Find tools, books & gadgets from students near you</p>
        </div>
      </div>

      <div className="container">
        <div className="mp-controls">
          <form className="mp-search" onSubmit={handleSearch}>
            <Search size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search items..."
            />
            <button type="submit">Search</button>
          </form>

          <div className="mp-filters">
            <div className="filter-group">
              <SlidersHorizontal size={14} />
              <span>Filter:</span>
              {['all', 'borrow', 'buy'].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${filterType === f ? 'active' : ''}`}
                  onClick={() => setFilterType(f)}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
              {SORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Category tabs */}
        <div className="cat-tabs">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`cat-tab ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mp-results-meta">
          <span>{items.length} items found {category !== 'All' && `in "${category}"`}</span>
        </div>

        {loading ? (
          <div className="mp-loading">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state" style={{ marginTop: '32px' }}>
            <div className="empty-emoji">🔍</div>
            <h3>No items found</h3>
            <p>Try different filters or be the first to list something!</p>
          </div>
        ) : (
          <div className="mp-grid">
            {items.map(item => <ItemCard key={item._id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
