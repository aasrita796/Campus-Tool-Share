import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, X, Plus } from 'lucide-react';
import './PostItem.css';

const CATEGORIES = ['Calculators', 'Electronics', 'Lab Kits', 'Books', 'Engineering Tools', 'Gadgets'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function PostItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    name: '', category: '', description: '', condition: '',
    location: '', borrowPrice: '', buyPrice: '',
    allowBorrow: true, allowBuy: true,
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files].slice(0, 5));
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews].slice(0, 5));
  };

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.description || !form.condition || !form.location) {
      toast.error('Please fill all required fields'); return;
    }
    if (!form.allowBorrow && !form.allowBuy) {
      toast.error('Enable at least one: Borrow or Buy'); return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      const res = await axios.post('/api/items', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Item posted successfully! 🎉');
      navigate(`/item/${res.data._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to post item');
    }
    setLoading(false);
  };

  return (
    <div className="post-page">
      <div className="container">
        <div className="post-header">
          <h1>Post an Item</h1>
          <p>List your tool, book, or gadget for the campus community</p>
        </div>

        <form className="post-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Left */}
            <div className="form-left">
              <div className="form-section">
                <h3>Item Details</h3>
                <div className="form-group">
                  <label>Item Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Casio Scientific Calculator" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Condition *</label>
                    <select name="condition" value={form.condition} onChange={handleChange}>
                      <option value="">Select condition</option>
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    placeholder="Describe your item — model, specs, what's included..." rows={4} />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Hyderabad, Madhapur" />
                </div>
              </div>

              <div className="form-section">
                <h3>Pricing</h3>
                <div className="pricing-options">
                  <label className={`pricing-toggle ${form.allowBorrow ? 'active' : ''}`}>
                    <input type="checkbox" name="allowBorrow" checked={form.allowBorrow} onChange={handleChange} />
                    <div>
                      <strong>Allow Borrow</strong>
                      <span>Students can borrow daily</span>
                    </div>
                  </label>
                  <label className={`pricing-toggle ${form.allowBuy ? 'active' : ''}`}>
                    <input type="checkbox" name="allowBuy" checked={form.allowBuy} onChange={handleChange} />
                    <div>
                      <strong>Allow Buy</strong>
                      <span>Students can purchase outright</span>
                    </div>
                  </label>
                </div>
                <div className="form-row" style={{ marginTop: '16px' }}>
                  {form.allowBorrow && (
                    <div className="form-group">
                      <label>Borrow Price / day (₹)</label>
                      <input type="number" name="borrowPrice" value={form.borrowPrice} onChange={handleChange} placeholder="e.g. 40" min="0" />
                    </div>
                  )}
                  {form.allowBuy && (
                    <div className="form-group">
                      <label>Buy Price (₹)</label>
                      <input type="number" name="buyPrice" value={form.buyPrice} onChange={handleChange} placeholder="e.g. 700" min="0" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="form-right">
              <div className="form-section">
                <h3>Photos</h3>
                <div className="upload-zone" onClick={() => document.getElementById('img-upload').click()}>
                  <Upload size={28} />
                  <p>Click to upload images</p>
                  <span>Up to 5 images, max 5MB each</span>
                  <input id="img-upload" type="file" multiple accept="image/*" onChange={handleImages} style={{ display: 'none' }} />
                </div>
                {previews.length > 0 && (
                  <div className="preview-grid">
                    {previews.map((src, i) => (
                      <div key={i} className="preview-item">
                        <img src={src} alt={`preview ${i}`} />
                        <button type="button" className="remove-img" onClick={() => removeImage(i)}>
                          <X size={12} />
                        </button>
                        {i === 0 && <span className="main-label">Main</span>}
                      </div>
                    ))}
                    {previews.length < 5 && (
                      <div className="preview-add" onClick={() => document.getElementById('img-upload').click()}>
                        <Plus size={20} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="post-summary">
                <h3>Preview Summary</h3>
                <div className="summary-item">
                  <span>Item</span><strong>{form.name || '—'}</strong>
                </div>
                <div className="summary-item">
                  <span>Category</span><strong>{form.category || '—'}</strong>
                </div>
                <div className="summary-item">
                  <span>Condition</span><strong>{form.condition || '—'}</strong>
                </div>
                {form.allowBorrow && form.borrowPrice && (
                  <div className="summary-item">
                    <span>Borrow</span><strong>₹{form.borrowPrice}/day</strong>
                  </div>
                )}
                {form.allowBuy && form.buyPrice && (
                  <div className="summary-item">
                    <span>Buy</span><strong>₹{form.buyPrice}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => navigate(-1)} style={{ padding: '14px 32px' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '14px 40px' }} disabled={loading}>
              {loading ? 'Posting...' : 'Post Item 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
