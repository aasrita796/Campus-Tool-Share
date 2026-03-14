const Item = require('../models/Item');
const path = require('path');

exports.getItems = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { buyPrice: 1 };
    if (sort === 'price_desc') sortObj = { buyPrice: -1 };

    const items = await Item.find(query).populate('owner', 'name location college').sort(sortObj);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name location college phone');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.views += 1;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, category, description, condition, location, borrowPrice, buyPrice, allowBorrow, allowBuy } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const item = await Item.create({
      name, category, description, condition, location,
      borrowPrice: Number(borrowPrice) || 0,
      buyPrice: Number(buyPrice) || 0,
      allowBorrow: allowBorrow === 'true',
      allowBuy: allowBuy === 'true',
      images,
      owner: req.user.id
    });

    const populated = await item.populate('owner', 'name location college');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('owner', 'name location');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
