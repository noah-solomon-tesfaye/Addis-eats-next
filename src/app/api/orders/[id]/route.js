import { getSession } from "../../../../lib/session";
import {
  getOrderForUser,
  cancelOrderForUser,
} from "../../../../lib/orders";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const order = await getOrderForUser(id, session.user.id);

  if (!order) {
    return Response.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  return Response.json(order);
}

export async function PATCH(request, { params }) {
  const session = await getSession();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  if (body?.action !== "cancel") {
    return Response.json(
      { error: "Unsupported order action." },
      { status: 400 }
    );
  }

  const order = await cancelOrderForUser(id, session.user.id);

  if (!order) {
    return Response.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  return Response.json(order);
}