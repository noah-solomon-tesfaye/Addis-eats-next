import { getSession } from "../../../../lib/session";
import {
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "../../../../lib/orders";

export const dynamic = "force-dynamic";

async function requireStaff() {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      error: Response.json(
        { error: "You must sign in first." },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "staff") {
    return {
      error: Response.json(
        { error: "You are not authorized to manage kitchen orders." },
        { status: 403 }
      ),
    };
  }

  return { session };
}

// GET /api/kitchen/orders
// Return orders to authorized kitchen staff.
export async function GET() {
  const access = await requireStaff();

  if (access.error) {
    return access.error;
  }

  try {
    const orders = await getAllOrdersForAdmin();

    return Response.json({ orders });
  } catch (error) {
    console.error("Failed to load kitchen orders:", error);

    return Response.json(
      { error: "Unable to load orders." },
      { status: 500 }
    );
  }
}

// PATCH /api/kitchen/orders
// Update an order's status.
export async function PATCH(request) {
  const access = await requireStaff();

  if (access.error) {
    return access.error;
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const { orderId, status } = body ?? {};

  if (typeof orderId !== "string" || !orderId.trim()) {
    return Response.json(
      { error: "A valid order ID is required." },
      { status: 400 }
    );
  }

  const allowedStatuses = [
    "pending",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return Response.json(
      { error: "Invalid order status." },
      { status: 400 }
    );
  }

  try {
    const order = await updateOrderStatus(orderId, status);

    if (!order) {
      return Response.json(
        { error: "Order not found or status invalid." },
        { status: 404 }
      );
    }

    return Response.json({ order });
  } catch (error) {
    console.error("Failed to update kitchen order:", error);

    return Response.json(
      { error: "Unable to update the order." },
      { status: 500 }
    );
  }
}