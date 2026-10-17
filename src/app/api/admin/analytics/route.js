import { getSession } from "../../../../lib/session";
import { getAllOrdersForAdmin } from "../../../../lib/orders";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return Response.json(
      { error: "Forbidden: administrator access required." },
      { status: 403 }
    );
  }

  const orders = await getAllOrdersForAdmin();

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Aggregate order counts by date.
  const dailyOrdersMap = new Map();

  for (const order of orders) {
    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const day = date.toISOString().slice(0, 10);

    dailyOrdersMap.set(
      day,
      (dailyOrdersMap.get(day) || 0) + 1
    );
  }

  const dailyOrders = Array.from(
    dailyOrdersMap,
    ([date, count]) => ({ date, count })
  ).sort((a, b) => a.date.localeCompare(b.date));

  // Aggregate revenue by neighbourhood.
  const neighbourhoodRevenueMap = new Map();

  for (const order of orders) {
    const neighbourhood =
      typeof order.neighbourhood === "string"
        ? order.neighbourhood.trim()
        : "";

    if (!neighbourhood || !Number.isFinite(order.total)) {
      continue;
    }

    neighbourhoodRevenueMap.set(
      neighbourhood,
      (neighbourhoodRevenueMap.get(neighbourhood) || 0) +
        order.total
    );
  }

  const revenueByNeighbourhood = Array.from(
    neighbourhoodRevenueMap,
    ([neighbourhood, revenue]) => ({
      neighbourhood,
      revenue,
    })
  ).sort((a, b) => b.revenue - a.revenue);

  const orderHistory = orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    itemCount: order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),
  }));

  return Response.json({
    summary: {
      totalOrders,
      totalRevenue,
      averageOrderValue,
    },
    dailyOrders,
    revenueByNeighbourhood,
    orderHistory,
  });
}