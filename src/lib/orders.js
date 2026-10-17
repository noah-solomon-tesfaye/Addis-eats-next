import { sql } from "./db";

const ALLOWED_STATUSES = [
  "pending",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

function formatOrder(row) {
  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    items:
      typeof row.items === "string"
        ? JSON.parse(row.items)
        : row.items,
    total: Number(row.total),
    neighbourhood: row.neighbourhood ?? null,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
  };
}

const ORDER_COLUMNS = `
  id,
  user_id,
  status,
  items,
  total,
  neighbourhood,
  created_at
`;

export async function getAllOrdersForAdmin() {
  const rows = await sql`
    SELECT ${sql.unsafe(ORDER_COLUMNS)}
    FROM orders
    ORDER BY created_at DESC
  `;

  return rows.map(formatOrder);
}

export async function getOrdersForUser(userId) {
  if (!userId) return [];

  const rows = await sql`
    SELECT ${sql.unsafe(ORDER_COLUMNS)}
    FROM orders
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  return rows.map(formatOrder);
}

export async function getOrderForUser(orderId, userId) {
  if (!orderId || !userId) return null;

  const rows = await sql`
    SELECT ${sql.unsafe(ORDER_COLUMNS)}
    FROM orders
    WHERE id = ${orderId}
      AND user_id = ${userId}
    LIMIT 1
  `;

  return rows.length ? formatOrder(rows[0]) : null;
}

export async function createOrderForUser(userId, orderDetails) {
  if (
    !userId ||
    !Array.isArray(orderDetails?.items) ||
    orderDetails.items.length === 0
  ) {
    return null;
  }

  const items = orderDetails.items.map((item) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity),
  }));

  const invalidItem = items.some(
    (item) =>
      !item.id ||
      typeof item.name !== "string" ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
  );

  if (invalidItem) return null;

  const total = Number(
    items
      .reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      .toFixed(2)
  );

  const neighbourhood =
    typeof orderDetails.neighbourhood === "string" &&
    orderDetails.neighbourhood.trim()
      ? orderDetails.neighbourhood.trim()
      : null;

  const id = `ord_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const rows = await sql`
    INSERT INTO orders (
      id,
      user_id,
      status,
      items,
      total,
      neighbourhood,
      created_at
    )
    VALUES (
      ${id},
      ${userId},
      'pending',
      ${JSON.stringify(items)}::jsonb,
      ${total},
      ${neighbourhood},
      NOW()
    )
    RETURNING ${sql.unsafe(ORDER_COLUMNS)}
  `;

  return formatOrder(rows[0]);
}

export async function cancelOrderForUser(orderId, userId) {
  if (!orderId || !userId) return null;

  const rows = await sql`
    UPDATE orders
    SET status = 'cancelled'
    WHERE id = ${orderId}
      AND user_id = ${userId}
      AND status <> 'cancelled'
    RETURNING ${sql.unsafe(ORDER_COLUMNS)}
  `;

  if (rows.length) {
    return formatOrder(rows[0]);
  }

  // Return an already-cancelled order without changing it.
  return getOrderForUser(orderId, userId).then((order) =>
    order?.status === "cancelled" ? order : null
  );
}

export async function updateOrderStatus(orderId, status) {
  if (!orderId || !ALLOWED_STATUSES.includes(status)) {
    return null;
  }

  const rows = await sql`
    UPDATE orders
    SET status = ${status}
    WHERE id = ${orderId}
    RETURNING ${sql.unsafe(ORDER_COLUMNS)}
  `;

  return rows.length ? formatOrder(rows[0]) : null;
}