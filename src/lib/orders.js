import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

async function readOrders() {
  try {
    const fileContents = await readFile(ordersFilePath, "utf8");
    const orders = JSON.parse(fileContents);

    if (!Array.isArray(orders)) {
      throw new Error("The orders JSON file must contain an array.");
    }

    return orders;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeOrders(orders) {
  await writeFile(
    ordersFilePath,
    JSON.stringify(orders, null, 2),
    "utf8"
  );
}

function formatOrder(order) {
  return {
    id: order.id,
    status: order.status,
    items: order.items,
    total: order.total,
    neighbourhood: order.neighbourhood ?? null,
    createdAt: order.createdAt,
  };
}

export async function getAllOrdersForAdmin() {
  const orders = await readOrders();
  return orders.map(formatOrder);
}

export async function getOrdersForUser(userId) {
  const orders = await readOrders();

  return orders
    .filter((order) => order.userId === userId)
    .map(formatOrder);
}

export async function getOrderForUser(orderId, userId) {
  const orders = await readOrders();

  const order = orders.find(
    (item) => item.id === orderId && item.userId === userId
  );

  return order ? formatOrder(order) : null;
}

export async function createOrderForUser(userId, orderDetails) {
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

  const neighbourhood =
    typeof orderDetails.neighbourhood === "string" &&
    orderDetails.neighbourhood.trim()
      ? orderDetails.neighbourhood.trim()
      : null;

  const order = {
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    status: "pending",
    items,
    total,
    neighbourhood,
    createdAt: new Date().toISOString(),
  };

  const orders = await readOrders();
  orders.push(order);

  await writeOrders(orders);

  return formatOrder(order);
}

export async function cancelOrderForUser(orderId, userId) {
  const orders = await readOrders();

  const order = orders.find(
    (item) => item.id === orderId && item.userId === userId
  );

  if (!order) {
    return null;
  }

  if (order.status !== "cancelled") {
    order.status = "cancelled";
    await writeOrders(orders);
  }

  return formatOrder(order);
}

/**
 * Update an order's status from the kitchen dashboard.
 * Only callers authorized by the API route should use this function.
 */
export async function updateOrderStatus(orderId, status) {
  const allowedStatuses = [
    "pending",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return null;
  }

  const orders = await readOrders();

  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return null;
  }

  order.status = status;

  await writeOrders(orders);

  return formatOrder(order);
}