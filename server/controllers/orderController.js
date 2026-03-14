const Order = require('../models/Order');
const Item = require('../models/Item');

exports.createOrder = async (req, res) => {
  try {
    const { itemId, type, borrowDays, startDate } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (!item.isAvailable) return res.status(400).json({ message: 'Item not available' });

    let totalAmount = 0;
    let endDate = null;

    if (type === 'buy') {
      totalAmount = item.buyPrice;
    } else if (type === 'borrow') {
      totalAmount = item.borrowPrice * (borrowDays || 1);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (borrowDays || 1));
    }

    const order = await Order.create({
      item: itemId,
      buyer: req.user.id,
      seller: item.owner,
      type,
      borrowDays: borrowDays || 1,
      totalAmount,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate
    });

    const populated = await order.populate([
      { path: 'item', select: 'name images' },
      { path: 'seller', select: 'name location' }
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('item', 'name images category')
      .populate('seller', 'name location')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getIncomingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate('item', 'name images category')
      .populate('buyer', 'name location college')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.seller.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
