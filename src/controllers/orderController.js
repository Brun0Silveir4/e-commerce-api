const orderService = require("../services/orderService");

class OrderController {
  async getAllOrders(req, res) {
    try {
      const userId = req.user.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const order = req.query.order || "desc";
      const status = req.query.status || undefined;

      const orders = await orderService.getAllOrders(
        userId,
        page,
        limit,
        order,
        status,
      );

      return res.status(200).json(orders);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  async createOrder(req, res) {
    const userId = req.user.id;

    const { items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: "Order items are required" });
    }
    try {
      const order = await orderService.createOrder(userId, items);
      return res.status(201).json(order);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  async cancelOrder(req, res) {
    const userId = req.user.id;
    const orderId = Number(req.params.orderId);

    try {
      const canceledOrder = await orderService.cancelOrder(userId, orderId);
      return res.status(200).json({ orderCancelled: canceledOrder });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  async getOrderById(req, res) {
    const userId = req.user.id;
    const orderId = Number(req.params.orderId);

    try {
      const order = await orderService.getOrderById(userId, orderId);
      return res.status(200).json(order);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  async payOrder(req, res) {
    const userId = req.user.id;
    const orderId = Number(req.params.orderId);

    try {
      const orderToPay = await orderService.payOrder(userId, orderId);
      return res.status(200).json({ orderPaid: orderToPay });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
}

module.exports = new OrderController();
