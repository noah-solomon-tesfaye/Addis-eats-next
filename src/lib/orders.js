const orders = [
  {
    id: "ord_001",
    userId: "usr_31",
    status: "preparing",
    items: [],
    total: 0,
    createdAt: new Date().toISOString(),
  },
];

export function getOrdersForUser(userId) {
  return orders
    .filter((order) => order.userId === userId)
    .map((order) => ({
      id: order.id,
      status: order.status,
      items: order.items,
      total: order.total,
      createdAt: order.createdAt,
    }));
}

export function getOrderForUser(orderId, userId) {
  const order = orders.find(
    (item) => item.id === orderId && item.userId === userId
  );

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    status: order.status,
    items: order.items,
    total: order.total,
    createdAt: order.createdAt,
  };
}

export function createOrderForUser(userId, orderDetails) {
  if (!userId || !Array.isArray(orderDetails?.items)) {
    return null;
  }

  if (orderDetails.items.length === 0) {
    return null;
  }

  const items = orderDetails.items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = {
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    status: "pending",
    items,
    total,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);

  return {
    id: order.id,
    status: order.status,
    items: order.items,
    total: order.total,
    createdAt: order.createdAt,
  };
}

export function cancelOrderForUser(orderId, userId) {
  const order = orders.find(
    (item) => item.id === orderId && item.userId === userId
  );

  if (!order) {
    return null;
  }

  if (order.status !== "cancelled") {
    order.status = "cancelled";
  }

  return {
    id: order.id,
    status: order.status,
    items: order.items,
    total: order.total,
    createdAt: order.createdAt,
  };
}