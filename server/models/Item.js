const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Calculators', 'Electronics', 'Lab Kits', 'Books', 'Engineering Tools', 'Gadgets'],
    required: true
  },
  description: { type: String, required: true },
  images: [{ type: String }],
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    required: true
  },
  location: { type: String, required: true },
  borrowPrice: { type: Number, default: 0 },
  buyPrice: { type: Number, default: 0 },
  allowBorrow: { type: Boolean, default: true },
  allowBuy: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
