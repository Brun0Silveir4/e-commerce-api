const prisma = require("../database");

class OrderService {
  async getAllOrders(
    id,
    page = 1,
    limit = 10,
    order = "desc",
    status = undefined,
  ) {
    const offset = (page - 1) * limit;

    const orders = await prisma.order.findMany({
      where: { userId: id, status: status },
      skip: offset,
      take: limit,
      orderBy: {
        id: order,
      },
      include: {
        items: true,
      },
    });

    return {
      items: orders,
      pagination: {
        page,
        limit,
        offset,
        totalItems: await prisma.order.count({
          where: { userId: id, status: status },
        }),
        totalPages: Math.ceil(
          (await prisma.order.count({ where: { userId: id, status: status } })) / limit,
        ),
      },
    };
  }

  async createOrder(userId, items) {
    let total = 0;

    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Product not found`);
      }

      total += product.price * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });
    return order;
  }

  async cancelOrder(userId, orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId !== userId) {
      throw new Error("Unauthorized to cancel this order");
    }

    if (order.status === "cancelled") {
      throw new Error("Order is already cancelled");
    }

    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "cancelled" },
    });
    return cancelledOrder;
  }

  async getOrderById(userId, orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }
    if (order.userId !== userId) {
      throw new Error("Unauthorized to view this order");
    }

    return order;
  }

  async payOrder(userId, orderId) {
    const orderToPay = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!orderToPay) {
      throw new Error("Order not found");
    }

    if (orderToPay.userId !== userId) {
      throw new Error("Unauthorized to pay this order");
    }

    if (orderToPay.status !== "pending") {
      throw new Error("Only pending orders can be paid");
    }

    const paidOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "confirmed" },
      include: { items: true },
    });
    return paidOrder;
  }
}

module.exports = new OrderService();
