const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/orderController');
const ensureAuth = require('../middlewares/ensureAuth'); 

router.get('/me', ensureAuth, OrderController.getAllOrders)
router.post('/newOrder', ensureAuth, OrderController.createOrder)

router.put('/cancel/:orderId', ensureAuth, OrderController.cancelOrder)
router.get('/:orderId', ensureAuth, OrderController.getOrderById)
router.put('/pay/:orderId', ensureAuth, OrderController.payOrder)

module.exports = router