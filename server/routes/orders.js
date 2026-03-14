const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createOrder, getMyOrders, getIncomingOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', auth, createOrder);
router.get('/my', auth, getMyOrders);
router.get('/incoming', auth, getIncomingOrders);
router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;
