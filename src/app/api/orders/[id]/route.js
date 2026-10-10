import { getSession } from "../../../../lib/session";
import {
  getOrderForUser,
  cancelOrderForUser,
} from "../../../../lib/orders";

export async function GET(request, { params }) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const order = getOrderForUser(id, session.user.id);

  if (!order) {
    return Response.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return Response.json(order);
}

export async function DELETE(request, { params }) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const order = cancelOrderForUser(id, session.user.id);

  if (!order) {
    return Response.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return Response.json(order);
}