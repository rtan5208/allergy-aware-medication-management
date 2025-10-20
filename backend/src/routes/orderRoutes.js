const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.get('/', auth, orderController.listOrders);
router.get('/:order_id', auth, orderController.getOrder);
router.post('/', auth, orderController.createOrder);
router.put('/:order_id', auth, orderController.updateOrder);
router.delete('/:order_id', auth, orderController.deleteOrder);

module.exports = router;
